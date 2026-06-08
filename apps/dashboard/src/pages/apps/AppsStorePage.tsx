import { Search, Download, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AppsStorePage = () => {
  const { t } = useTranslation();

  const storeApps = [
    { id: 1, name: 'Advanced Analytics', category: 'Marketing', rating: 4.8, reviews: 124, icon: '📊', price: t('apps.store.free'), description: 'Real-time traffic and conversion insights.' },
    { id: 2, name: 'Live Chat Support', category: 'Customer Service', rating: 4.9, reviews: 342, icon: '💬', price: t('apps.store.priceMonthly', { price: '9.99' }), description: 'Connect with your customers instantly.' },
    { id: 3, name: 'Social Media Sync', category: 'Marketing', rating: 4.5, reviews: 89, icon: '🔄', price: t('apps.store.free'), description: 'Auto-publish content to multiple platforms.' },
    { id: 4, name: 'Loyalty Program', category: 'Sales', rating: 4.7, reviews: 210, icon: '🎁', price: t('apps.store.priceMonthly', { price: '19.99' }), description: 'Reward your best customers and increase retention.' },
  ];

  const categories = [
    t('media.all'),
    t('apps.store.categories.marketing'),
    t('apps.store.categories.sales'),
    t('apps.store.categories.design'),
    t('apps.store.categories.inventory'),
    t('apps.store.categories.support')
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('apps.store.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('apps.store.description')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-surface border border-cf-border rounded-lg p-4">
            <h3 className="font-medium text-cf-text mb-4">{t('apps.store.filter')}</h3>
            <div className="space-y-2">
              {categories.map((cat, i) => (
                <label key={i} className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={i === 0} />
                  <span className="text-sm text-gray-600 group-hover:text-cf-text transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-surface border border-cf-border rounded-lg p-4">
            <h3 className="font-medium text-cf-text mb-4">{t('products.columns.price')}</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" name="price" className="border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="text-sm text-gray-600 group-hover:text-cf-text transition-colors">{t('media.all')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" name="price" className="border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600 group-hover:text-cf-text transition-colors">{t('apps.store.free')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="radio" name="price" className="border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600 group-hover:text-cf-text transition-colors">{t('apps.store.paid')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('apps.store.search')} 
              className="w-full pl-11 pr-4 py-3 bg-surface border border-cf-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {storeApps.map(app => (
              <div key={app.id} className="bg-surface border border-cf-border rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer flex gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0 text-3xl flex items-center justify-center rounded-xl border border-gray-200 group-hover:scale-105 transition-transform">
                  {app.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-cf-text truncate pr-2">{app.name}</h3>
                    <span className="text-sm font-medium text-green-600 flex-shrink-0">{app.price}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-cf-gray-text mb-2">
                    <span>{app.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <div className="flex items-center text-amber-500">
                      <Star size={12} fill="currentColor" className="mr-1" />
                      <span className="font-medium">{app.rating}</span>
                      <span className="text-gray-400 ml-1">({app.reviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {app.description}
                  </p>
                  <button className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} className="mr-2" />
                    {t('apps.store.install')}
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

export default AppsStorePage;
