import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Upload, Folder, MoreVertical, Grid, List, Trash2, X, 
  ChevronDown, FolderPlus, File, FileText, FileSpreadsheet, 
  Presentation, Film, Music, Archive, Image as ImageIcon,
  Copy, Check, ExternalLink, Download, FolderUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { webbios } from '../../api';
import { DropdownMenu, DropdownMenuItem, Select, SearchInput } from '@webbios/ui';

// ─── Helpers ───────────────────────────────────────────────
const getFileTypeIcon = (mimeType: string | null, size?: number) => {
  if (!mimeType) return <File size={size || 48} className="text-gray-400" />;
  if (mimeType === 'folder') return <Folder size={size || 48} className="text-amber-500" />;
  if (mimeType.startsWith('image/')) return <ImageIcon size={size || 48} className="text-blue-500" />;
  if (mimeType.startsWith('video/')) return <Film size={size || 48} className="text-purple-500" />;
  if (mimeType.startsWith('audio/')) return <Music size={size || 48} className="text-pink-500" />;
  if (mimeType === 'application/pdf') return <FileText size={size || 48} className="text-red-500" />;
  if (mimeType.includes('word') || mimeType.includes('document')) return <FileText size={size || 48} className="text-blue-600" />;
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FileSpreadsheet size={size || 48} className="text-green-600" />;
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return <Presentation size={size || 48} className="text-orange-500" />;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar') || mimeType.includes('gz')) return <Archive size={size || 48} className="text-yellow-600" />;
  return <File size={size || 48} className="text-gray-400" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return dateStr; }
};

// ─── Component ─────────────────────────────────────────────
const MediaPage = () => {
  const { t } = useTranslation();
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [cdnUrl, setCdnUrl] = useState('https://cdn.webbios.dev');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);

  // View & Filter
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [typeFilter, setTypeFilter] = useState<'all'|'file'|'folder'>('all');
  const [timeFilter, setTimeFilter] = useState<'all'|'today'|'7days'|'30days'|'this_year'|'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [appliedCustomDate, setAppliedCustomDate] = useState({ start: '', end: '' });
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Navigation
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null, name: string}[]>([{ id: null, name: 'Home' }]);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const ITEMS_PER_PAGE = 24;

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Drag & Drop
  const [isDragOver, setIsDragOver] = useState(false);

  // Create folder modal
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Inline rename
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Copy URL feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
        setShowFolderModal(false);
        setShowCustomDateModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    webbios.settings.getSettings().then(settings => {
      if (settings['system.cdn_url']) {
        let url = settings['system.cdn_url'];
        if (url.startsWith('"')) url = JSON.parse(url);
        setCdnUrl(url.replace(/\/$/, ''));
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (timeFilter === 'custom' && (!appliedCustomDate.start || !appliedCustomDate.end)) return;
    fetchMedia();
  }, [page, typeFilter, timeFilter, appliedCustomDate.start, appliedCustomDate.end, sortBy, currentFolderId]);

  const fetchMedia = async (q?: string) => {
    setIsLoading(true);
    try {
      const res = await webbios.media.list({ 
        search: q !== undefined ? q : appliedSearch, 
        limit: ITEMS_PER_PAGE,
        page,
        type: typeFilter,
        time: timeFilter,
        startDate: timeFilter === 'custom' ? appliedCustomDate.start : undefined,
        endDate: timeFilter === 'custom' ? appliedCustomDate.end : undefined,
        sort: sortBy as any,
        folderId: currentFolderId || undefined
      });
      if (res.success) {
        setMediaList(res.data);
        if (res.pagination) {
          setPagination({ total: res.pagination.total, totalPages: res.pagination.totalPages });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setAppliedSearch(search);
      setPage(1);
      fetchMedia(search);
    }
  };

  const handleSearchClick = () => {
    if (!search.trim() && !appliedSearch) {
      searchInputRef.current?.focus();
      return;
    }
    setAppliedSearch(search);
    setPage(1);
    fetchMedia(search);
  };

  const getMediaUrl = (media: any) => {
    if (!media.url) return '';
    return `${cdnUrl}${media.url.startsWith('/') ? '' : '/'}${media.url}`;
  };

  // ─── Upload handlers ─────────────────────────────────────
  const uploadFile = async (file: File, parentId: string | null = currentFolderId) => {
    try {
      const res = await webbios.media.upload(file, 'Uploads', parentId || undefined);
      return res;
    } catch (error: any) {
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        const res = await uploadFile(files[i]);
        if (res.success) successCount++;
      } catch (err) {}
    }
    setIsUploading(false);
    if (successCount > 0) fetchMedia();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    // We need to keep track of created folder IDs based on their path
    // root -> folderName -> subfolder
    const folderIdCache = new Map<string, string>();
    folderIdCache.set('', currentFolderId || '');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const pathParts = file.webkitRelativePath ? file.webkitRelativePath.split('/') : [file.name];
      
      // Remove the filename from the path
      pathParts.pop();
      
      let currentPath = '';
      let parentId = currentFolderId;

      // Ensure all directories in the path exist
      for (const part of pathParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (folderIdCache.has(currentPath)) {
          parentId = folderIdCache.get(currentPath) || null;
        } else {
          try {
            const res = await webbios.media.createFolder(part, parentId || undefined);
            if (res.success && res.data) {
              const newFolderId = res.data.id;
              folderIdCache.set(currentPath, newFolderId);
              parentId = newFolderId;
            }
          } catch (err) {
            console.error('Failed to create folder:', part);
          }
        }
      }
      
      try {
        await uploadFile(file, parentId);
      } catch (err) {}
    }

    setIsUploading(false);
    fetchMedia();
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  // ─── Drag & Drop ──────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    for (const file of files) {
      try {
        const res = await uploadFile(file as File);
        if (res.success) successCount++;
      } catch (err) {}
    }
    setIsUploading(false);
    if (successCount > 0) fetchMedia();
  }, [currentFolderId]);

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm(t('media.confirmDelete'))) return;
    try {
      const res = await webbios.media.delete(id);
      if (res.success) {
        setMediaList(prev => prev.filter(m => m.id !== id));
        setSelectedMedia(null);
        setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      } else {
        alert(res.error || 'Delete failed');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(t('media.confirmBulkDelete', { count: selectedIds.size }))) return;
    try {
      const res = await webbios.media.bulkDelete(Array.from(selectedIds));
      if (res.success) {
        setSelectedIds(new Set());
        fetchMedia();
      } else {
        alert(res.error || 'Delete failed');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ─── Update metadata ─────────────────────────────────────
  const handleUpdateMetadata = async (id: string, filename: string, alt: string) => {
    try {
      const res = await webbios.media.update(id, { filename, alt });
      if (res.success) {
        setMediaList(prev => prev.map(m => m.id === id ? { ...m, filename, alt } : m));
        setSelectedMedia(null);
      } else {
        alert(res.error || 'Update failed');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ─── Create folder ───────────────────────────────────────
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await webbios.media.createFolder(newFolderName.trim(), currentFolderId || undefined);
      if (res.success) {
        setShowFolderModal(false);
        setNewFolderName('');
        fetchMedia();
      } else {
        alert(res.error || 'Create folder failed');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // ─── Inline rename ───────────────────────────────────────
  const handleInlineRename = async (id: string) => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      const res = await webbios.media.update(id, { filename: editingName.trim() });
      if (res.success) {
        setMediaList(prev => prev.map(m => m.id === id ? { ...m, filename: editingName.trim() } : m));
        setEditingId(null);
      }
    } catch (error: any) {
      alert(error.message);
      setEditingId(null);
    }
  };

  // ─── Copy URL ────────────────────────────────────────────
  const handleCopyUrl = async (media: any, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = getMediaUrl(media);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(media.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* fallback */ }
  };

  // ─── Selection ───────────────────────────────────────────
  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === mediaList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(mediaList.map(m => m.id)));
    }
  };

  // ─── Pagination helpers ──────────────────────────────────
  const getPageNumbers = () => {
    const { totalPages } = pagination;
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const pages: (number | string)[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, pagination.total);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div 
      className="space-y-6"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-500/10 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-dashed border-blue-400">
            <FolderUp size={64} className="mx-auto text-blue-500 mb-4" />
            <p className="text-xl font-semibold text-gray-800">{t('media.dragDropTitle')}</p>
            <p className="text-sm text-gray-500 mt-1">{t('media.dragDropSubtitle')}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('media.title')}</h1>
          <div className="flex items-center gap-2 text-sm text-cf-gray-text mt-1">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id || 'root'}>
                {idx > 0 && <span className="text-gray-400">/</span>}
                <button 
                  onClick={() => {
                    setCurrentFolderId(crumb.id);
                    setBreadcrumbs(prev => prev.slice(0, idx + 1));
                    setPage(1);
                  }}
                  className={`hover:text-blue-600 transition-colors ${idx === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
                >
                  {crumb.id === null ? <span className="flex items-center gap-1"><Folder size={14} />{t('media.all')}</span> : crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Create folder button */}
          <button 
            onClick={() => setShowFolderModal(true)}
            className="flex items-center space-x-2 bg-white border border-cf-border hover:bg-gray-50 text-cf-text px-4 py-2 rounded-md transition-colors shadow-sm"
          >
            <FolderPlus size={16} />
            <span>{t('media.newFolder')}</span>
          </button>

          {/* Upload dropdown */}
          <DropdownMenu 
            align="right" 
            trigger={
              <button 
                disabled={isUploading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={16} />}
                <span>{isUploading ? t('media.uploading') : t('media.upload')}</span>
                <ChevronDown size={14} />
              </button>
            }
          >
            <DropdownMenuItem 
              onClick={() => fileInputRef.current?.click()} 
              icon={<File className="w-4 h-4" />}
            >
              {t('media.uploadFile')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => folderInputRef.current?.click()} 
              icon={<FolderUp className="w-4 h-4" />}
            >
              {t('media.uploadFolder')}
            </DropdownMenuItem>
          </DropdownMenu>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
          <input 
            type="file" 
            ref={folderInputRef} 
            onChange={handleFolderChange} 
            className="hidden" 
            {...({ webkitdirectory: '', directory: '', mozdirectory: '' } as any)}
            multiple 
          />
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {t('media.selected', { count: selectedIds.size })}
            </span>
            <button onClick={toggleSelectAll} className="text-sm text-blue-600 hover:text-blue-800 underline">
              {selectedIds.size === mediaList.length ? t('media.deselectAll') : t('media.selectAll')}
            </button>
          </div>
          <button 
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            {t('media.bulkDelete')}
          </button>
        </div>
      )}

      {/* Content card */}
      <div className="bg-surface border border-cf-border rounded-lg shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-cf-border flex flex-wrap items-center justify-between gap-3">
          {/* Left: search + search btn + filter tabs */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px] flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <SearchInput
                ref={searchInputRef}
                value={search}
                onChange={handleSearch}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('media.search')}
                onClear={() => {
                  setSearch('');
                  searchInputRef.current?.focus();
                  if (appliedSearch !== '') {
                    setAppliedSearch('');
                    setPage(1);
                    fetchMedia('');
                  }
                }}
                className="w-full"
              />
            </div>
            <button 
              onClick={handleSearchClick} 
              className="px-4 py-2 bg-white border border-cf-border hover:bg-gray-50 text-cf-text text-sm font-medium rounded-md shadow-sm transition-colors shrink-0"
            >
              {t('media.searchBtn')}
            </button>
          </div>

          {/* Right: sort + view toggle */}
          <div className="flex items-center gap-2">
            <Select 
              value={typeFilter}
              onChange={e => { setTypeFilter(e.target.value as any); setPage(1); }}
            >
              <option value="all">{t('media.filterAll')}</option>
              <option value="folder">{t('media.filterFolders')}</option>
              <option value="file">{t('media.filterFiles')}</option>
            </Select>

            <Select 
              value={timeFilter}
              onChange={e => { 
                const val = e.target.value as any;
                if (val === 'custom') {
                  setShowCustomDateModal(true);
                } else {
                  setTimeFilter(val); 
                  setPage(1); 
                }
              }}
            >
              <option value="all">{t('media.timeFilter.all')}</option>
              <option value="today">{t('media.timeFilter.today')}</option>
              <option value="7days">{t('media.timeFilter.last7days')}</option>
              <option value="30days">{t('media.timeFilter.last30days')}</option>
              <option value="this_year">{t('media.timeFilter.thisYear')}</option>
              <option value="custom">{t('media.timeFilter.custom')}</option>
            </Select>

            {timeFilter === 'custom' && appliedCustomDate.start && appliedCustomDate.end && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowCustomDateModal(true)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-md border border-blue-200 hover:bg-blue-100 transition-colors"
                  title={t('media.timeFilter.edit')}
                >
                  {formatDate(appliedCustomDate.start).split(' ')[0]} - {formatDate(appliedCustomDate.end).split(' ')[0]}
                </button>
                <button 
                  onClick={() => {
                    setTimeFilter('all');
                    setPage(1);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title={t('media.timeFilter.clear')}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <Select 
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPage(1); }}
            >
              <option value="newest">{t('media.sort.newest')}</option>
              <option value="oldest">{t('media.sort.oldest')}</option>
              <option value="name_asc">{t('media.sort.nameAsc')}</option>
              <option value="name_desc">{t('media.sort.nameDesc')}</option>
              <option value="size_asc">{t('media.sort.sizeAsc')}</option>
              <option value="size_desc">{t('media.sort.sizeDesc')}</option>
            </Select>
            <div className="flex items-center bg-white border border-cf-border rounded-md p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-200 shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                title={t('media.grid')}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-200 shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                title={t('media.list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Folder size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="mb-6">{t('media.emptyUploadFirst')}</p>
              {currentFolderId && (
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setShowFolderModal(true)}
                    className="flex items-center space-x-2 bg-white border border-cf-border hover:bg-gray-50 text-cf-text px-4 py-2 rounded-md transition-colors shadow-sm text-sm font-medium"
                  >
                    <FolderPlus size={16} />
                    <span>{t('media.newFolder')}</span>
                  </button>
                  <DropdownMenu 
                    align="left" 
                    trigger={
                      <button 
                        disabled={isUploading}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors shadow-sm text-sm font-medium"
                      >
                        {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Upload size={16} />}
                        <span>{isUploading ? t('media.uploading') : t('media.upload')}</span>
                        <ChevronDown size={14} />
                      </button>
                    }
                  >
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()} icon={<File className="w-4 h-4" />}>{t('media.uploadFile')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => folderInputRef.current?.click()} icon={<FolderUp className="w-4 h-4" />}>{t('media.uploadFolder')}</DropdownMenuItem>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* ─── Grid View ──────────────────────────────────── */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {mediaList.map(media => {
                const isImage = media.mimeType?.startsWith('image/');
                const isFolder = media.mimeType === 'folder';
                const url = getMediaUrl(media);
                const isSelected = selectedIds.has(media.id);
                
                return (
                  <div 
                    key={media.id} 
                    className={`group relative bg-background border rounded-lg overflow-hidden hover:shadow-md transition-all flex flex-col aspect-square ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-cf-border hover:border-blue-500'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`absolute top-2 left-2 z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                      <button
                        onClick={(e) => toggleSelect(media.id, e)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white/90 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                      </button>
                    </div>

                    {/* Copy URL button */}
                    {!isFolder && (
                      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleCopyUrl(media, e)}
                          className="p-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-md shadow-sm hover:bg-white transition-colors"
                          title={t('media.copyUrl')}
                        >
                          {copiedId === media.id ? <Check size={12} className="text-green-600" /> : <Copy size={12} className="text-gray-500" />}
                        </button>
                      </div>
                    )}

                    {/* Preview area */}
                    <div 
                      className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden cursor-pointer" 
                      onClick={() => {
                        if (isFolder) {
                          setCurrentFolderId(media.id);
                          setBreadcrumbs(prev => [...prev, { id: media.id, name: media.filename }]);
                          setPage(1);
                        } else {
                          setSelectedMedia(media);
                        }
                      }}
                    >
                      {isImage ? (
                        <img src={url} alt={media.alt || media.filename} className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        getFileTypeIcon(media.mimeType)
                      )}
                    </div>

                    {/* Info bar */}
                    <div className="p-2 border-t border-cf-border bg-surface flex items-center justify-between">
                      <div className="truncate flex-1 min-w-0">
                        {editingId === media.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onBlur={() => handleInlineRename(media.id)}
                            onKeyDown={e => { if (e.key === 'Enter') handleInlineRename(media.id); if (e.key === 'Escape') setEditingId(null); }}
                            className="text-xs w-full px-1 py-0.5 border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <p 
                            className="text-xs font-medium text-cf-text truncate cursor-pointer" 
                            title={media.filename}
                            onDoubleClick={() => { setEditingId(media.id); setEditingName(media.filename); }}
                          >
                            {media.filename}
                          </p>
                        )}
                        {!isFolder && <p className="text-[10px] text-cf-gray-text">{formatFileSize(media.size)}</p>}
                      </div>
                      <button onClick={() => setSelectedMedia(media)} className="text-gray-400 hover:text-cf-text shrink-0 ml-1">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── List View ──────────────────────────────────── */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cf-border text-left">
                    <th className="pb-3 pl-2 pr-4 w-8">
                      <button
                        onClick={toggleSelectAll}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedIds.size === mediaList.length && mediaList.length > 0
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {selectedIds.size === mediaList.length && mediaList.length > 0 && <Check size={10} />}
                      </button>
                    </th>
                    <th className="pb-3 text-xs font-semibold text-cf-gray-text uppercase tracking-wider">{t('media.columns.name')}</th>
                    <th className="pb-3 text-xs font-semibold text-cf-gray-text uppercase tracking-wider w-24">{t('media.columns.size')}</th>
                    <th className="pb-3 text-xs font-semibold text-cf-gray-text uppercase tracking-wider w-32">{t('media.columns.type')}</th>
                    <th className="pb-3 text-xs font-semibold text-cf-gray-text uppercase tracking-wider w-40">{t('media.columns.uploadedAt')}</th>
                    <th className="pb-3 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {mediaList.map(media => {
                    const isImage = media.mimeType?.startsWith('image/');
                    const isFolder = media.mimeType === 'folder';
                    const url = getMediaUrl(media);
                    const isSelected = selectedIds.has(media.id);

                    return (
                      <tr 
                        key={media.id} 
                        className={`border-b border-cf-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          if (isFolder) {
                            setCurrentFolderId(media.id);
                            setBreadcrumbs(prev => [...prev, { id: media.id, name: media.filename }]);
                            setPage(1);
                          } else {
                            setSelectedMedia(media);
                          }
                        }}
                      >
                        <td className="py-2.5 pl-2 pr-4">
                          <button
                            onClick={(e) => toggleSelect(media.id, e)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'border-gray-300 hover:border-blue-500'
                            }`}
                          >
                            {isSelected && <Check size={10} />}
                          </button>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden shrink-0">
                              {isImage ? (
                                <img src={url} alt={media.filename} className="w-full h-full object-cover" />
                              ) : (
                                getFileTypeIcon(media.mimeType, 20)
                              )}
                            </div>
                            <div className="min-w-0">
                              {editingId === media.id ? (
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={e => setEditingName(e.target.value)}
                                  onBlur={() => handleInlineRename(media.id)}
                                  onKeyDown={e => { 
                                    e.stopPropagation();
                                    if (e.key === 'Enter') handleInlineRename(media.id); 
                                    if (e.key === 'Escape') setEditingId(null); 
                                  }}
                                  onClick={e => e.stopPropagation()}
                                  className="text-sm w-full px-1 py-0.5 border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                              ) : (
                                <p 
                                  className="text-sm font-medium text-cf-text truncate" 
                                  title={media.filename}
                                  onDoubleClick={(e) => { e.stopPropagation(); setEditingId(media.id); setEditingName(media.filename); }}
                                >
                                  {media.filename}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 text-sm text-cf-gray-text">{isFolder ? '—' : formatFileSize(media.size)}</td>
                        <td className="py-2.5 text-sm text-cf-gray-text">
                          {isFolder ? t('media.folder') : (media.mimeType || '—')}
                        </td>
                        <td className="py-2.5 text-sm text-cf-gray-text">{formatDate(media.createdAt)}</td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1">
                            {!isFolder && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleCopyUrl(media, e); }}
                                className="p-1.5 text-gray-400 hover:text-cf-text rounded-md hover:bg-gray-100 transition-colors"
                                title={t('media.copyUrl')}
                              >
                                {copiedId === media.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && pagination.total > 0 && (
          <div className="px-4 py-3 border-t border-cf-border flex items-center justify-between">
            <span className="text-sm text-cf-gray-text">
              {t('media.showingResults', { start: startItem, end: endItem, total: pagination.total })}
            </span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-cf-border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t('media.prev')}
              </button>
              {getPageNumbers().map((p, i) => (
                typeof p === 'number' ? (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-sm rounded-md transition-colors ${
                      page === p 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'hover:bg-gray-50 text-cf-text border border-cf-border'
                    }`}
                  >
                    {p}
                  </button>
                ) : (
                  <span key={i} className="px-1 text-cf-gray-text">…</span>
                )
              ))}
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-sm border border-cf-border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t('media.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── File Details Modal ──────────────────────────── */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMedia(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMedia(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{t('media.details')}</h2>
            
            <div className="space-y-4">
              {/* Preview */}
              <div className="bg-gray-100 rounded-md overflow-hidden flex items-center justify-center p-2 h-48 sm:h-64">
                {selectedMedia.mimeType?.startsWith('image/') ? (
                  <img src={getMediaUrl(selectedMedia)} className="max-w-full max-h-full object-contain mx-auto" />
                ) : (
                  getFileTypeIcon(selectedMedia.mimeType, 64)
                )}
              </div>

              {/* Dimensions & size info */}
              {selectedMedia.mimeType?.startsWith('image/') && (selectedMedia.width || selectedMedia.height) && (
                <div className="flex gap-4 text-xs text-cf-gray-text">
                  <span>{t('media.dimensions')}: {selectedMedia.width}×{selectedMedia.height}px</span>
                </div>
              )}
              <div className="flex gap-4 text-xs text-cf-gray-text">
                <span>{t('media.fileSize')}: {formatFileSize(selectedMedia.size)}</span>
                <span>{t('media.createdAt')}: {formatDate(selectedMedia.createdAt)}</span>
              </div>

              {/* Filename */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{t('media.filename')}</label>
                <input 
                  type="text" 
                  defaultValue={selectedMedia.filename}
                  id="media-filename"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Alt tag */}
              {selectedMedia.mimeType !== 'folder' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('media.altTag')}</label>
                  <input 
                    type="text" 
                    defaultValue={selectedMedia.alt || ''}
                    id="media-alt"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* CDN URL */}
              {selectedMedia.mimeType !== 'folder' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">{t('media.cdnLink')}</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 break-all">
                      {getMediaUrl(selectedMedia)}
                    </div>
                    <button
                      onClick={() => handleCopyUrl(selectedMedia)}
                      className="shrink-0 p-2 text-gray-500 hover:text-cf-text border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                      title={t('media.copyUrl')}
                    >
                      {copiedId === selectedMedia.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer actions */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
              <button onClick={() => handleDelete(selectedMedia.id)} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                <Trash2 size={14} className="mr-1" />
                {t('common.actions.delete', 'Delete')}
              </button>
              <div className="flex items-center space-x-2">
                {/* Download (icon only) */}
                {selectedMedia.mimeType !== 'folder' && (
                  <a 
                    href={getMediaUrl(selectedMedia)}
                    download={selectedMedia.filename}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                    title={t('media.download')}
                  >
                    <Download size={16} />
                  </a>
                )}
                {/* View file (icon only) */}
                {selectedMedia.mimeType !== 'folder' && (
                  <a 
                    href={getMediaUrl(selectedMedia)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                    title={t('media.viewFile')}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                {/* Save changes */}
                <button 
                  onClick={() => {
                    const filename = (document.getElementById('media-filename') as HTMLInputElement).value;
                    const altEl = document.getElementById('media-alt') as HTMLInputElement;
                    const alt = altEl ? altEl.value : '';
                    handleUpdateMetadata(selectedMedia.id, filename, alt);
                  }} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('common.actions.save', 'Save changes')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create Folder Modal ────────────────────────── */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowFolderModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowFolderModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <FolderPlus size={20} className="text-amber-500" />
              {t('media.createFolderTitle')}
            </h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">{t('media.folderName')}</label>
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); }}
                placeholder={t('media.folderNamePlaceholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {t('common.actions.cancel', 'Cancel')}
              </button>
              <button 
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors"
              >
                {t('common.actions.create', 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Custom Date Modal ────────────────────────── */}
      {showCustomDateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCustomDateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCustomDateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{t('media.timeFilter.customTitle')}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('media.timeFilter.startDate')}</label>
                <input 
                  type="date" 
                  value={customDateRange.start}
                  onChange={e => setCustomDateRange(p => ({ ...p, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('media.timeFilter.endDate')}</label>
                <input 
                  type="date" 
                  value={customDateRange.end}
                  onChange={e => setCustomDateRange(p => ({ ...p, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowCustomDateModal(false);
                  if (timeFilter === 'custom' && (!customDateRange.start || !customDateRange.end)) {
                    setTimeFilter('all');
                  }
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium text-sm"
              >
                {t('media.timeFilter.cancel')}
              </button>
              <button 
                onClick={() => {
                  setAppliedCustomDate(customDateRange);
                  setTimeFilter('custom');
                  setShowCustomDateModal(false);
                  setPage(1);
                }}
                disabled={!customDateRange.start || !customDateRange.end}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 font-medium text-sm"
              >
                {t('media.timeFilter.apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
