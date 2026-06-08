import { Shield, CheckCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LicensesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-cf-text">{t('webbios.licenses.title')}</h1>
        <p className="text-cf-gray-text mt-1">{t('webbios.licenses.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface border border-cf-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-green-500" size={24} />
            <h2 className="text-lg font-medium text-cf-text">{t('webbios.licenses.coreTitle')}</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-gray-text">{t('webbios.licenses.statusLabel')}</span>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center">
                <CheckCircle size={14} className="mr-1" /> {t('webbios.licenses.statusActive')}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-gray-text">{t('webbios.licenses.durationLabel')}</span>
              <span className="font-medium text-cf-text">{t('webbios.licenses.durationPermanent')}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-cf-gray-text">{t('webbios.licenses.shopIdLabel')}</span>
              <span className="font-mono bg-cf-hover px-1.5 py-0.5 rounded text-cf-text">01J18XY...</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="text-blue-500" size={20} />
              <h2 className="text-lg font-medium text-blue-900">{t('webbios.licenses.proTitle')}</h2>
            </div>
            <p className="text-sm text-blue-700 mb-4">
              {t('webbios.licenses.proDesc')}
            </p>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors">
            {t('webbios.licenses.upgradeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
