import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Search, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import type { WebbiSDK } from '@webbios/sdk';

export interface MediaManagerProps {
  client: WebbiSDK;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaManager({
  client,
  isOpen,
  onClose,
  onSelect
}: MediaManagerProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<{ name?: string; filename?: string; url: string; size: number; lastModified?: string; createdAt?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchMedia();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchMedia = async (searchQuery: string = '') => {
    setIsLoading(true);
    try {
      const res = await client.media.list({ limit: 100, search: searchQuery });
      if (res.success) {
        setFiles(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch media', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    try {
      setIsUploading(true);
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const res = await client.media.upload(file);
        if (res.success && res.data) {
          setFiles(prev => [res.data, ...prev]);
        }
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error: any) {
      alert(error.message || 'Connection error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  const filteredFiles = files.filter(f => (f.name || f.filename || '').toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-cf-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-cf-text">{t('media.title', 'Media Library')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-cf-border flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('media.search', 'Search media files...')}
              className="block w-full pl-10 pr-3 py-2 border border-cf-border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="hidden"
              multiple
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isUploading ? t('common.loading', 'Uploading...') : t('media.uploadImage', 'Upload')}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => {
                const displayName = file.name || file.filename || 'Image';
                return (
                <div
                  key={file.url}
                  onClick={() => setSelectedUrl(file.url)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedUrl === file.url ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={file.url.startsWith('/') ? `https://cdn.webbios.dev${file.url}` : file.url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <p className="text-xs text-white truncate" title={displayName}>{displayName}</p>
                    <p className="text-[10px] text-gray-300">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  {selectedUrl === file.url && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">{t('media.noMedia', 'No media available')}</h3>
                <p className="text-xs text-gray-500 mb-4">{t('media.noMediaDesc', 'Upload files to your R2 bucket to see them here.')}</p>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  {t('media.uploadImage', 'Upload Image')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cf-border bg-white flex justify-end space-x-3 rounded-b-xl">
          <Button variant="outline" onClick={onClose}>{t('media.cancel', 'Cancel')}</Button>
          <Button disabled={!selectedUrl} onClick={handleConfirm}>{t('media.select', 'Select Image')}</Button>
        </div>
      </div>
    </div>
  );
}
