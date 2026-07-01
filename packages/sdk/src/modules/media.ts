import { ApiClient } from '../client';

export interface MediaRecord {
  id: string;
  filename: string;
  r2Key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface MediaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MediaListResponse {
  success: boolean;
  data: MediaRecord[];
  pagination: MediaPagination;
}

export interface MediaListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'all' | 'file' | 'folder';
  sort?: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'size_asc' | 'size_desc';
  time?: 'all' | 'today' | '7days' | '30days' | 'this_year' | 'custom';
  startDate?: string;
  endDate?: string;
  folderId?: string;
}

export class MediaModule {
  constructor(private client: ApiClient) {}

  /**
   * Retrieves a paginated list of media files with filters and sorting.
   */
  async list(params?: MediaListParams): Promise<MediaListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'all') query.append('type', params.type);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.time && params.time !== 'all') query.append('time', params.time);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    if (params?.folderId) query.append('folderId', params.folderId);
    
    return this.client.get(`/media?${query.toString()}`);
  }

  /**
   * Uploads a new media file.
   */
  async upload(file: File, folder?: string, parentId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    if (parentId) formData.append('parentId', parentId);
    
    return this.client.post('/media/upload', formData);
  }

  /**
   * Creates a new folder.
   */
  async createFolder(name: string, parentId?: string) {
    return this.client.post('/media/folders', { name, parentId });
  }

  /**
   * Updates metadata of a media file.
   */
  async update(id: string, data: { filename?: string; alt?: string }) {
    return this.client.put(`/media/${id}`, data);
  }

  /**
   * Deletes a media file.
   */
  async delete(id: string) {
    return this.client.delete(`/media/${id}`);
  }

  /**
   * Deletes multiple media items at once.
   */
  async bulkDelete(ids: string[]) {
    return this.client.post('/media/bulk-delete', { ids });
  }
}
