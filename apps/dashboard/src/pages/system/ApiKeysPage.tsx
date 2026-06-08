import { Plus, Key, Copy, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ApiKeysPage = () => {
  const { t } = useTranslation();

  const apiKeys = [
    { id: 1, name: 'Production API Key', key: 'sk_live_...a8f9', prefix: 'sk_live_', created: '15/05/2026', lastUsed: '2 mins ago' },
    { id: 2, name: 'Development Key', key: 'sk_test_...3b2c', prefix: 'sk_test_', created: '20/05/2026', lastUsed: 'Never used' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('apiKeys.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('apiKeys.description')}</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm">
          <Plus size={16} />
          <span>{t('apiKeys.create')}</span>
        </button>
      </div>

      <div className="bg-surface border border-cf-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cf-border bg-gradient-to-r from-blue-50/50 to-transparent">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Key size={24} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{t('apiKeys.securityTitle', 'Secure your API Keys')}</h3>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                {t('apiKeys.securityDescription', 'API keys provide full access to your system data. Never share them publicly or store them in client-side code.')}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-cf-border">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">{t('apiKeys.columns.name')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('apiKeys.columns.key')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('apiKeys.columns.created')}</th>
                <th scope="col" className="px-6 py-3 font-medium">{t('apiKeys.columns.lastUsed')}</th>
                <th scope="col" className="px-6 py-3 text-right font-medium">{t('apiKeys.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cf-border">
              {apiKeys.map(apiKey => (
                <tr key={apiKey.id} className="bg-surface hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-cf-text">
                    {apiKey.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-mono text-xs border border-gray-200">
                        {apiKey.key}
                      </code>
                      <button className="text-gray-400 hover:text-blue-600" title={t('apiKeys.copy')}>
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {apiKey.created}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {apiKey.lastUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50" title={t('apiKeys.revoke')}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {t('apiKeys.empty', 'No API keys created yet.')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
