import { Upload, Folder, Search, Filter, MoreVertical, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MediaPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('media.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('media.description')}</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
          <Upload size={16} />
          <span>{t('media.upload')}</span>
        </button>
      </div>

      <div className="bg-surface border border-cf-border rounded-lg shadow-sm">
        <div className="p-4 border-b border-cf-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-1 min-w-[200px] max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder={t('media.search')} 
                className="w-full pl-9 pr-4 py-2 bg-background border border-cf-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>
            <button className="p-2 border border-cf-border rounded-md hover:bg-cf-hover text-cf-gray-text transition-colors">
              <Filter size={16} />
            </button>
          </div>
          <div className="flex items-center space-x-2 bg-background border border-cf-border rounded-md p-1">
            <button className="p-1.5 bg-surface shadow-sm rounded text-cf-text">
              <Grid size={16} />
            </button>
            <button className="p-1.5 text-cf-gray-text hover:text-cf-text">
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Folders */}
            {[1, 2].map(i => (
              <div key={`folder-${i}`} className="group relative bg-background border border-cf-border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center aspect-square">
                <Folder size={48} className="text-blue-500 mb-3" strokeWidth={1.5} />
                <span className="text-sm font-medium text-cf-text text-center truncate w-full">Folder {i}</span>
                <span className="text-xs text-cf-gray-text mt-1">12 items</span>
                <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-cf-text opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
            
            {/* Images */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={`img-${i}`} className="group relative bg-background border border-cf-border rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col aspect-square">
                <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i}/300/300`} alt={`Media ${i}`} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-2 border-t border-cf-border bg-surface flex items-center justify-between">
                  <div className="truncate flex-1">
                    <p className="text-xs font-medium text-cf-text truncate">image-{i}.jpg</p>
                    <p className="text-[10px] text-cf-gray-text">2.4 MB</p>
                  </div>
                  <button className="text-gray-400 hover:text-cf-text">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
