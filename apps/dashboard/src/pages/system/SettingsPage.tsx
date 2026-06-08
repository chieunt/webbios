import React, { useState } from 'react';
import { Save, Globe, Lock, Bell, Palette, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: t('settings.tabs.general'), icon: Globe },
    { id: 'security', name: t('settings.tabs.security'), icon: Lock },
    { id: 'notifications', name: t('header.notifications'), icon: Bell },
    { id: 'appearance', name: t('settings.tabs.appearance'), icon: Palette },
    { id: 'email', name: t('settings.tabs.email'), icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('settings.title')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('settings.description')}</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors shadow-sm font-medium">
          <Save size={16} />
          <span>{t('settings.save')}</span>
        </button>
      </div>

      <div className="bg-surface border border-cf-border rounded-xl shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-cf-border bg-gray-50/30 flex-shrink-0">
          <div className="p-4">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-8 bg-surface">
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.siteInfo', 'Thông tin website')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.siteName')}</label>
                    <input type="text" defaultValue="My WebbiOS Site" className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.siteDescription')}</label>
                    <textarea rows={3} defaultValue="Powered by WebbiOS" className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-cf-border">
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.regionAndLanguage', 'Khu vực & Ngôn ngữ')}</h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.timezone')}</label>
                    <select className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>Asia/Ho_Chi_Minh (GMT+7)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.language')}</label>
                    <select className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option>Tiếng Việt (vi)</option>
                      <option>English (en)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Globe, { size: 32, className: "text-gray-400" })}
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">{t('common.actions.settings', 'Cài đặt')} {tabs.find(t => t.id === activeTab)?.name.toLowerCase()}</p>
                <p className="text-sm">{t('common.messages.underConstruction', 'Chức năng đang được phát triển.')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
