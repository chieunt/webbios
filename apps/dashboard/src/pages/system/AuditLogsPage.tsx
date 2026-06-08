import { Search, Calendar, Download, RefreshCw, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuditLogsPage = () => {
  const { t } = useTranslation();

  const logs = [
    { id: 1, action: 'User Login', user: 'admin@webbios.local', details: 'Successfully logged in from 192.168.1.1', time: '10:45 AM', date: '05/06/2026', status: 'success' },
    { id: 2, action: 'Update Setting', user: 'admin@webbios.local', details: 'Changed site name to "My WebbiOS Site"', time: '10:42 AM', date: '05/06/2026', status: 'success' },
    { id: 3, action: 'Failed Login', user: 'unknown', details: 'Invalid password for user test@example.com', time: '09:15 AM', date: '05/06/2026', status: 'error' },
    { id: 4, action: 'Install App', user: 'admin@webbios.local', details: 'Installed E-commerce Core v2.1.0', time: 'Yesterday', date: '04/06/2026', status: 'success' },
    { id: 5, action: 'Create Role', user: 'admin@webbios.local', details: 'Created new role "Moderator"', time: 'Yesterday', date: '04/06/2026', status: 'success' },
  ];

  const timeFilters = [
    t('audit.timeFilters.all'),
    t('audit.timeFilters.today'),
    t('audit.timeFilters.last7Days'),
    t('audit.timeFilters.last30Days')
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('audit.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('audit.description')}</p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 border border-cf-border bg-surface rounded-md hover:bg-gray-50 text-cf-text transition-colors shadow-sm" title={t('audit.refresh')}>
            <RefreshCw size={18} />
          </button>
          <button className="flex items-center space-x-2 border border-cf-border bg-surface hover:bg-gray-50 text-cf-text px-4 py-2 rounded-md transition-colors shadow-sm">
            <Download size={16} />
            <span>{t('audit.export')}</span>
          </button>
        </div>
      </div>

      <div className="bg-surface border border-cf-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cf-border flex flex-wrap items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('audit.search')} 
              className="w-full pl-9 pr-4 py-2 bg-background border border-cf-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select className="pl-9 pr-8 py-2 bg-background border border-cf-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              {timeFilters.map((filter, index) => (
                <option key={index}>{filter}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-cf-border">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">{t('audit.columns.action')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('audit.columns.user')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('audit.columns.details')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('audit.columns.date')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border">
              {logs.map(log => (
                <tr key={log.id} className="bg-surface hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-full ${log.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <Activity size={14} />
                      </div>
                      <span className="font-medium text-cf-text">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{log.time}</div>
                    <div className="text-xs text-gray-400">{log.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
