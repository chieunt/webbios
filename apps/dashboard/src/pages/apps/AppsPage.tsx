import { Settings, ExternalLink, Trash2, CheckCircle2, Play, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AppsPage = () => {
  const { t } = useTranslation();
  
  const installedApps = [
    { id: 1, name: 'E-commerce Core', vendor: 'WebbiOS', status: 'running', icon: '🛍️', version: '2.1.0', description: 'Core functionality for managing products, orders, and customers.' },
    { id: 2, name: 'Blog Engine', vendor: 'WebbiOS', status: 'stopped', icon: '📝', version: '1.0.4', description: 'Publish articles and manage blog content easily.' },
    { id: 3, name: 'SEO Optimizer', vendor: 'Third Party', status: 'running', icon: '🚀', version: '3.2.1', description: 'Automated SEO improvements and meta tag management.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cf-text">{t('apps.installed.title')}</h1>
        <p className="text-sm text-cf-gray-text mt-1">{t('apps.installed.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {installedApps.map(app => (
          <div key={app.id} className="bg-surface border border-cf-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-lg border border-blue-100">
                    {app.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-cf-text">{app.name}</h3>
                    <p className="text-sm text-cf-gray-text">{app.vendor} • v{app.version}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${app.status === 'running' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {app.status === 'running' ? <CheckCircle2 size={12} className="mr-1"/> : <Square size={12} className="mr-1"/>}
                  {app.status === 'running' ? t('apps.installed.running') : t('apps.installed.stopped')}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {app.description}
              </p>
            </div>
            
            <div className="border-t border-cf-border px-5 py-4 bg-background/50 flex items-center justify-between rounded-b-xl">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title={t('apps.installed.settings')}>
                  <Settings size={18} />
                </button>
                {app.status === 'running' ? (
                  <button className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title={t('apps.installed.stop')}>
                    <Square size={18} />
                  </button>
                ) : (
                  <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title={t('apps.installed.restart')}>
                    <Play size={18} />
                  </button>
                )}
                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title={t('apps.installed.uninstall')}>
                  <Trash2 size={18} />
                </button>
              </div>
              <button className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                <span>{t('apps.installed.openApp')}</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppsPage;
