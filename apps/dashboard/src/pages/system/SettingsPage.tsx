import React, { useState, useEffect } from 'react';
import { Save, Globe, Lock, Bell, Palette, Mail, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { webbios } from '../../api';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Form State
  const [settings, setSettings] = useState<Record<string, any>>({
    'site.name': '',
    'site.phone': '',
    'site.timezone': 'Asia/Ho_Chi_Minh (GMT+7)',
    'site.language': 'vi',
    'site.currency': 'VND',
    'site.measurement': 'kg',
    'format.order_prefix': 'ORD-',
    'format.invoice_prefix': 'INV-',
    'security.require_2fa': false,
    'security.password_policy': 'medium',
    'smtp.host': '',
    'smtp.port': '587',
    'smtp.user': '',
    'smtp.pass': '',
    'smtp.from': '',
    'system.license_plan': 'free',
    'system.cdn_url': 'https://cdn.webbios.dev'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Fetch all settings
      const data = await webbios.settings.getSettings();
      const parsedData: Record<string, any> = {};
      for (const key in data) {
        try {
          parsedData[key] = JSON.parse(data[key]);
        } catch {
          parsedData[key] = data[key];
        }
      }
      setSettings(prev => ({ ...prev, ...parsedData }));
    } catch (err) {
      console.error('Failed to load settings', err);
      showToast('error', t('settings.messages.loadFailed', 'Cannot load settings'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, any> = {};
      for (const key in settings) {
        payload[key] = JSON.stringify(settings[key]);
      }
      await webbios.settings.updateSettings(payload);
      
      // Update language realtime if it changed
      if (settings['site.language'] !== i18n.language) {
        await i18n.changeLanguage(settings['site.language']);
      }

      showToast('success', t('settings.messages.saveSuccess', 'Settings updated successfully'));
    } catch (err) {
      console.error('Failed to save settings', err);
      showToast('error', t('settings.messages.saveFailed', 'Error saving settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tabs = [
    { id: 'general', name: t('settings.tabs.general', 'General Settings'), icon: Globe },
    { id: 'security', name: t('settings.tabs.security', 'Security'), icon: Lock },
    { id: 'notifications', name: t('settings.tabs.notifications', 'Notifications'), icon: Bell },
    { id: 'appearance', name: t('settings.tabs.appearance', 'Appearance'), icon: Palette },
    { id: 'email', name: t('settings.tabs.email', 'Email'), icon: Mail },
  ];

  const isFreePlan = settings['system.license_plan'] === 'free';

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity animate-in fade-in ${toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toastMessage.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-cf-text">{t('settings.title', 'System Settings')}</h1>
          <p className="text-sm text-cf-gray-text mt-1">{t('settings.description', 'Configure system parameters and business standards')}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-md transition-colors shadow-sm font-medium"
        >
          <Save size={16} />
          <span>{isSaving ? t('settings.saving', 'Saving...') : t('settings.save', 'Save changes')}</span>
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
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-[#0051c3] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'general' ? (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.siteInfo', 'Business Information')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.siteName', 'Business Name')}</label>
                    <input 
                      type="text" 
                      name="site.name"
                      value={settings['site.name'] || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.sitePhone', 'Contact Phone')}</label>
                    <input 
                      type="text" 
                      name="site.phone"
                      value={settings['site.phone'] || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-cf-border">
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.systemConfig', 'System Configuration')}</h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.cdnUrl', 'CDN Domain (For Media Library)')}</label>
                    <input 
                      type="text" 
                      name="system.cdn_url"
                      value={settings['system.cdn_url'] || ''}
                      onChange={handleInputChange}
                      placeholder="https://cdn.yourdomain.com"
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('settings.general.cdnUrlDesc', 'This domain must have a CNAME pointing to your Cloudflare R2 bucket.')}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-cf-border">
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.regionAndLanguage', 'Region & Language')}</h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.timezone', 'Timezone')}</label>
                    <select 
                      name="site.timezone"
                      value={settings['site.timezone'] || 'Asia/Ho_Chi_Minh (GMT+7)'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Asia/Ho_Chi_Minh (GMT+7)">Asia/Ho_Chi_Minh (GMT+7)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.language', 'Default Language')}</label>
                    <select 
                      name="site.language"
                      value={settings['site.language'] || 'vi'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="vi">{t('settings.general.languageVi', 'Tiếng Việt (vi)')}</option>
                      <option value="en">{t('settings.general.languageEn', 'English - Int (en)')}</option>
                      <option value="en-US">{t('settings.general.languageEnUS', 'English - US (en-US)')}</option>
                      <option value="en-GB">{t('settings.general.languageEnGB', 'English - UK (en-GB)')}</option>
                      <option value="es">{t('settings.general.languageEs', 'Español (es)')}</option>
                      <option value="fr">{t('settings.general.languageFr', 'Français (fr)')}</option>
                      <option value="de">{t('settings.general.languageDe', 'Deutsch (de)')}</option>
                      <option value="id">{t('settings.general.languageId', 'Bahasa Indonesia (id)')}</option>
                      <option value="th">{t('settings.general.languageTh', 'ไทย (th)')}</option>
                      <option value="zh-CN">{t('settings.general.languageZhCN', '简体中文 (zh-CN)')}</option>
                      <option value="zh-TW">{t('settings.general.languageZhTW', '繁體中文 (zh-TW)')}</option>
                      <option value="ja">{t('settings.general.languageJa', '日本語 (ja)')}</option>
                      <option value="ko">{t('settings.general.languageKo', '한국어 (ko)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.currency', 'Default Currency')}</label>
                    <select 
                      name="site.currency"
                      value={settings['site.currency'] || 'VND'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="VND">VND - Việt Nam Đồng</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.measurement', 'Measurement Unit')}</label>
                    <select 
                      name="site.measurement"
                      value={settings['site.measurement'] || 'kg'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="kg">Kilogram (kg) & cm</option>
                      <option value="lb">Pound (lb) & inch</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-cf-border">
                <h2 className="text-lg font-medium text-cf-text mb-4">{t('settings.general.formatOptions', 'Document Codes (Format)')}</h2>
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.orderPrefix', 'Order Prefix')}</label>
                    <input 
                      type="text" 
                      name="format.order_prefix"
                      value={settings['format.order_prefix'] || ''}
                      onChange={handleInputChange}
                      placeholder="ORD-"
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.general.invoicePrefix', 'Invoice Prefix')}</label>
                    <input 
                      type="text" 
                      name="format.invoice_prefix"
                      value={settings['format.invoice_prefix'] || ''}
                      onChange={handleInputChange}
                      placeholder="INV-"
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'security' ? (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-1">{t('settings.security.title', 'System Security')}</h2>
                <div className="space-y-6 mt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{t('settings.security.require2fa', 'Require 2-Factor Authentication (2FA)')}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t('settings.security.require2faDesc', 'Force all employees to set up and use 2FA when logging in.')}</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="security.require_2fa" checked={settings['security.require_2fa'] === 'true' || settings['security.require_2fa'] === true} onChange={handleInputChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-cf-border">
                    <h3 className="text-sm font-medium text-gray-900">{t('settings.security.passwordPolicy', 'Password Policy')}</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">{t('settings.security.passwordPolicyDesc', 'Define password complexity requirements for all accounts.')}</p>
                    <select 
                      name="security.password_policy"
                      value={settings['security.password_policy'] || 'medium'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="low">{t('settings.security.policyLow', 'Low (Minimum 6 characters)')}</option>
                      <option value="medium">{t('settings.security.policyMedium', 'Medium (Minimum 8 characters, with numbers)')}</option>
                      <option value="high">{t('settings.security.policyHigh', 'High (Min 8 chars, uppercase, number, special char)')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'notifications' ? (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-1">{t('settings.notifications.title', 'Notification Channels')}</h2>
                <p className="text-sm text-gray-500 mb-6">{t('settings.notifications.description', 'Configure how the system sends notifications to the Admin team.')}</p>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">{t('settings.notifications.email', 'Receive via Email')}</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">{t('settings.notifications.inApp', 'Receive via App (Web Push)')}</span>
                  </label>
                  <label className="flex items-center space-x-3 opacity-60">
                    <input type="checkbox" disabled className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">{t('settings.notifications.zalo', 'Receive via Zalo ZNS (In development)')}</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 border-t border-cf-border">
                <h3 className="text-sm font-medium text-gray-900 mb-4">{t('settings.notifications.events', 'Trigger Events')}</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">{t('settings.notifications.onNewOrder', 'On new order')}</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-700">{t('settings.notifications.onNewUser', 'On new user registration')}</span>
                  </label>
                </div>
              </div>
            </div>
          ) : activeTab === 'appearance' ? (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-1">{t('settings.appearance.title', 'ERP Appearance')}</h2>
                <p className="text-sm text-gray-500 mb-6">{t('settings.appearance.description', 'Configure internal brand identity for the ERP.')}</p>

                {isFreePlan ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <ShieldAlert className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-800">{t('settings.appearance.freePlanNotice', 'Feature only available on Webbi Pro plan')}</h3>
                      <p className="text-sm text-amber-700 mt-1 mb-4">{t('settings.appearance.freePlanDesc', 'To change Logo and Favicon, please upgrade to the Webbi Pro plan.')}</p>
                      <button className="text-sm bg-white border border-amber-300 text-amber-800 px-4 py-1.5 rounded font-medium hover:bg-amber-100 transition-colors">
                        {t('settings.appearance.upgradeBtn', 'Upgrade now')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.appearance.logo', 'System Logo')}</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                          {t('settings.appearance.uploadBtn', 'Upload Image')}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.appearance.favicon', 'Favicon')}</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                          <img src="/favicon.svg" alt="Favicon" className="w-5 h-5" />
                        </div>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                          {t('settings.appearance.uploadBtn', 'Upload Image')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'email' ? (
            <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-medium text-cf-text mb-1">{t('settings.email.title', 'Email Configuration (SMTP)')}</h2>
                <p className="text-sm text-gray-500 mb-6">{t('settings.email.description', 'Configure the mail server for the system to send internal notification emails.')}</p>

                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mb-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email.host', 'SMTP Host')}</label>
                    <input 
                      type="text" 
                      name="smtp.host"
                      value={settings['smtp.host'] || ''}
                      onChange={handleInputChange}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email.port', 'SMTP Port')}</label>
                    <input 
                      type="text" 
                      name="smtp.port"
                      value={settings['smtp.port'] || '587'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email.from', 'Sender Email (From)')}</label>
                    <input 
                      type="email" 
                      name="smtp.from"
                      value={settings['smtp.from'] || ''}
                      onChange={handleInputChange}
                      placeholder="no-reply@domain.com"
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email.user', 'Username')}</label>
                    <input 
                      type="text" 
                      name="smtp.user"
                      value={settings['smtp.user'] || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.email.pass', 'Password')}</label>
                    <input 
                      type="password" 
                      name="smtp.pass"
                      value={settings['smtp.pass'] || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-5 mt-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-blue-900">{t('settings.email.upsellBanner', 'Need to send bulk Email Marketing?')}</h3>
                      <p className="text-sm text-blue-800 mt-1 mb-4">{t('settings.email.upsellDesc', 'Explore the professional Mailer App in the App Store with bulk templates and detailed statistics.')}</p>
                      <button className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        {t('settings.email.exploreApps', 'Explore App Store')}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
