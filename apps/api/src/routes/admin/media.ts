import { Hono } from 'hono'
import { getDb } from '../../db'
import { wbMedia, wbStats } from '@webbios/db/src/schema'
import { eq, desc, like, and, asc, sql, inArray, ne, isNull, gte, lte } from 'drizzle-orm'
import { authMiddleware } from '../../middlewares/auth'
import { ulid } from 'ulid'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
  STORAGE: R2Bucket
}

const mediaApp = new Hono<{ Bindings: Bindings }>()

mediaApp.use('*', authMiddleware)

// ──────────────────────────────────────────────
// GET /media — List media with pagination, filters, sorting
// ──────────────────────────────────────────────
mediaApp.get('/', async (c) => {
  try {
    const db = getDb(c.env.DB)
    const { 
      search = '', 
      page = '1', 
      limit = '20',
      type = 'all',        // 'all' | 'file' | 'folder'
      sort = 'newest',     // 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size_asc' | 'size_desc'
      time = 'all',        // 'all' | 'today' | '7days' | '30days' | 'this_year' | 'custom'
      startDate,
      endDate,
      folderId            // optional: filter by parent folder
    } = c.req.query()
    
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const offset = (pageNum - 1) * limitNum

    // Build WHERE conditions
    const conditions: any[] = []

    if (search) {
      conditions.push(like(wbMedia.filename, `%${search}%`))
    } else {
      if (folderId) {
        conditions.push(eq(wbMedia.parentId, folderId))
      } else {
        conditions.push(isNull(wbMedia.parentId))
      }
    }

    if (type === 'folder') {
      conditions.push(eq(wbMedia.mimeType, 'folder'))
    } else if (type === 'file') {
      conditions.push(ne(wbMedia.mimeType, 'folder'))
    }

    if (time !== 'all') {
      const now = new Date()
      const toSqliteDate = (d: Date) => d.toISOString().replace('T', ' ').substring(0, 19)
      
      if (time === 'today') {
        now.setHours(0, 0, 0, 0)
        conditions.push(gte(wbMedia.createdAt, toSqliteDate(now)))
      } else if (time === '7days') {
        now.setDate(now.getDate() - 7)
        conditions.push(gte(wbMedia.createdAt, toSqliteDate(now)))
      } else if (time === '30days') {
        now.setDate(now.getDate() - 30)
        conditions.push(gte(wbMedia.createdAt, toSqliteDate(now)))
      } else if (time === 'this_year') {
        now.setMonth(0, 1)
        now.setHours(0, 0, 0, 0)
        conditions.push(gte(wbMedia.createdAt, toSqliteDate(now)))
      } else if (time === 'custom' && startDate && endDate) {
        conditions.push(gte(wbMedia.createdAt, toSqliteDate(new Date(startDate))))
        const endD = new Date(endDate)
        endD.setHours(23, 59, 59, 999)
        conditions.push(lte(wbMedia.createdAt, toSqliteDate(endD)))
      }
    }

    // Build the query
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Determine sort order
    let orderBy: any
    switch (sort) {
      case 'oldest':
        orderBy = asc(wbMedia.createdAt)
        break
      case 'name_asc':
        orderBy = asc(wbMedia.filename)
        break
      case 'name_desc':
        orderBy = desc(wbMedia.filename)
        break
      case 'size_asc':
        orderBy = asc(wbMedia.size)
        break
      case 'size_desc':
        orderBy = desc(wbMedia.size)
        break
      case 'newest':
      default:
        orderBy = desc(wbMedia.createdAt)
        break
    }

    // Get total count for pagination
    let total = 0
    
    // Tối ưu hóa đếm file:
    // Nếu ĐANG CÓ tìm kiếm hoặc LỌC type hoặc LỌC time -> dùng COUNT(*)
    if (search || type !== 'all' || time !== 'all') {
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(wbMedia)
        .where(whereClause)
      total = countResult[0]?.count || 0
    } 
    // Nếu KHÔNG tìm kiếm, KHÔNG lọc type -> dùng counter
    else {
      if (!folderId) {
        // Thư mục gốc: lấy tổng từ wb_stats
        const stats = await db.select().from(wbStats).where(
          and(
            eq(wbStats.appSlug, 'media'),
            eq(wbStats.entity, 'root')
          )
        )
        let totalFiles = 0
        let totalFolders = 0
        stats.forEach(s => {
          if (s.metric === 'total_files') totalFiles = s.value || 0
          if (s.metric === 'total_folders') totalFolders = s.value || 0
        })
        total = totalFiles + totalFolders
      } else {
        // Thư mục con: lấy từ thư mục cha
        const folder = await db.select({ fileCount: wbMedia.fileCount, folderCount: wbMedia.folderCount }).from(wbMedia).where(eq(wbMedia.id, folderId)).limit(1)
        if (folder.length > 0) {
          total = (folder[0].fileCount || 0) + (folder[0].folderCount || 0)
        }
      }
    }

    // Get paginated items
    let query = db.select().from(wbMedia)
    if (whereClause) {
      query = query.where(whereClause) as any
    }
    const items = await query.orderBy(orderBy).limit(limitNum).offset(offset)
    
    return c.json({ 
      success: true, 
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ──────────────────────────────────────────────
// POST /media/upload — Upload a file
// ──────────────────────────────────────────────
mediaApp.post('/upload', async (c) => {
  try {
    const userPayload = c.get('user')
    const formData = await c.req.parseBody()
    const file = formData['file'] as File

    if (!file) {
      return c.json({ error: 'No file provided' }, 400)
    }

    const fileExtension = file.name.split('.').pop()
    const isImage = file.type.startsWith('image/')
    
    // Save to UserProfiles if it's an avatar upload indicated by frontend, or Uploads by default
    const folder = formData['folder'] || 'Uploads'
    const parentId = formData['parentId'] as string | undefined
    
    // We should use original filename for the DB, but unique name for R2
    const originalFilename = file.name
    const r2Key = `${folder}/${userPayload.sub}-${Date.now()}.${fileExtension}`

    // Upload to R2
    await c.env.STORAGE.put(r2Key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
      },
    })

    const db = getDb(c.env.DB)
    
    const url = `/${r2Key}`
    
    const mediaId = ulid()

    await db.insert(wbMedia).values({
      id: mediaId,
      parentId: parentId || null,
      filename: originalFilename,
      r2Key: r2Key,
      url: url,
      mimeType: file.type,
      size: file.size,
      uploadedBy: userPayload.sub,
    })
    
    const newMedia = await db.select().from(wbMedia).where(eq(wbMedia.id, mediaId)).limit(1)

    return c.json({ success: true, data: newMedia[0] })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ──────────────────────────────────────────────
// POST /media/folders — Create a folder
// ──────────────────────────────────────────────
mediaApp.post('/folders', async (c) => {
  try {
    const userPayload = c.get('user')
    const body = await c.req.json()
    const { name, parentId } = body

    if (!name || !name.trim()) {
      return c.json({ error: 'Folder name is required' }, 400)
    }

    const db = getDb(c.env.DB)
    const folderId = ulid()

    await db.insert(wbMedia).values({
      id: folderId,
      parentId: parentId || null,
      filename: name.trim(),
      r2Key: `folders/${folderId}`,  // Virtual key, no actual R2 object
      url: '',
      mimeType: 'folder',
      size: 0,
      uploadedBy: userPayload.sub,
    })

    const newFolder = await db.select().from(wbMedia).where(eq(wbMedia.id, folderId)).limit(1)

    return c.json({ success: true, data: newFolder[0] })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ──────────────────────────────────────────────
// DELETE /media/:id — Delete a single media item
// ──────────────────────────────────────────────
mediaApp.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const db = getDb(c.env.DB)
    
    const mediaRecord = await db.select().from(wbMedia).where(eq(wbMedia.id, id)).limit(1)
    
    if (mediaRecord.length === 0) {
      return c.json({ error: 'Media not found' }, 404)
    }
    
    const media = mediaRecord[0]
    
    // Only delete from R2 if it's a real file (not a folder)
    if (media.mimeType !== 'folder') {
      await c.env.STORAGE.delete(media.r2Key)
    }
    
    // Delete from DB
    await db.delete(wbMedia).where(eq(wbMedia.id, id))
    
    return c.json({ success: true, message: 'Media deleted successfully' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ──────────────────────────────────────────────
// POST /media/bulk-delete — Delete multiple media items
// ──────────────────────────────────────────────
mediaApp.post('/bulk-delete', async (c) => {
  try {
    const body = await c.req.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: 'No IDs provided' }, 400)
    }

    const db = getDb(c.env.DB)

    // Fetch all records to get R2 keys
    const records = await db.select().from(wbMedia).where(inArray(wbMedia.id, ids))

    // Delete from R2 (only real files, not folders)
    const r2Deletions = records
      .filter(r => r.mimeType !== 'folder')
      .map(r => c.env.STORAGE.delete(r.r2Key))
    
    await Promise.allSettled(r2Deletions)

    // Delete from DB
    await db.delete(wbMedia).where(inArray(wbMedia.id, ids))

    return c.json({ success: true, message: `Deleted ${ids.length} items` })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// ──────────────────────────────────────────────
// PUT /media/:id — Update metadata
// ──────────────────────────────────────────────
mediaApp.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const { filename, alt } = body
    
    const db = getDb(c.env.DB)
    
    const updateData: any = {}
    if (filename !== undefined) updateData.filename = filename
    if (alt !== undefined) updateData.alt = alt
    
    if (Object.keys(updateData).length > 0) {
      await db.update(wbMedia).set(updateData).where(eq(wbMedia.id, id))
    }
    
    const updatedMedia = await db.select().from(wbMedia).where(eq(wbMedia.id, id)).limit(1)
    
    return c.json({ success: true, data: updatedMedia[0] })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

export default mediaApp
