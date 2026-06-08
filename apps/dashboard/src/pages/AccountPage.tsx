import { useState } from 'react';
import { useAuth } from '../App';
import { User, Mail, Shield, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cf-text">{t('account.title')}</h1>
        <p className="text-sm text-cf-gray-text mt-1">{t('account.description')}</p>
      </div>

      <div className="bg-surface border border-cf-border rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-cf-border bg-gray-50/50 flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3.5 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <User size={16} />
            <span>{t('account.tabs.profile')}</span>
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3.5 text-sm font-medium flex items-center space-x-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'password' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <Shield size={16} />
            <span>{t('account.tabs.security')}</span>
          </button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-3xl font-bold border-4 border-white shadow-md relative group cursor-pointer">
                  {user?.firstName?.charAt(0) || 'U'}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{t('users.actions.edit')}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{user?.firstName} {user?.lastName}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Mail size={14} className="mr-1.5" />
                    {user?.email}
                  </div>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {t('account.profile.role')} {user?.role === 'owner' ? t('system.roles.modal.namePlaceholder', 'Admin') : user?.role}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.profile.firstName')}</label>
                  <input type="text" defaultValue={user?.firstName} className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.profile.lastName')}</label>
                  <input type="text" defaultValue={user?.lastName} className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.profile.email')}</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed" />
                  <p className="text-xs text-gray-500 mt-1">{t('account.profile.emailNote')}</p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-cf-border">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition-colors shadow-sm font-medium">
                  <Save size={16} />
                  <span>{t('account.profile.update')}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6 max-w-md animate-in fade-in duration-300">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.security.currentPassword')}</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.security.newPassword')}</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                {/* Optional description, removed or abstracted */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('account.security.confirmPassword')}</label>
                <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-background border border-cf-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="pt-4">
                <button className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md transition-colors shadow-sm font-medium">
                  <Shield size={16} />
                  <span>{t('account.security.update')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
