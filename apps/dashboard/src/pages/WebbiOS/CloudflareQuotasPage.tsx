import { Database, Server, Zap, ExternalLink } from 'lucide-react';
import { Button } from '@webbios/ui';
import { useTranslation } from 'react-i18next';

export function CloudflareQuotasPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('webbios.cloudflareQuotas.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('webbios.cloudflareQuotas.description')}
          </p>
        </div>
        <Button 
          onClick={() => window.open('https://dash.cloudflare.com', '_blank')}
          className="flex items-center gap-2 bg-[#F38020] hover:bg-[#d66f1b] text-white"
        >
          <ExternalLink className="h-4 w-4" />
          {t('webbios.cloudflareQuotas.dashboardBtn')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers Quota */}
        <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-sm">
              <Server className="h-4 w-4 text-orange-500" />
              {t('webbios.cloudflareQuotas.workers.title')}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold">12,450</div>
              <div className="text-sm text-gray-500">{t('webbios.cloudflareQuotas.workers.unit')}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {t('webbios.cloudflareQuotas.workers.desc')}
            </p>
          </div>
        </div>

        {/* D1 Quota */}
        <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-blue-500" />
              {t('webbios.cloudflareQuotas.d1.title')}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold">450,200</div>
              <div className="text-sm text-gray-500">{t('webbios.cloudflareQuotas.d1.unit')}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '9%' }}></div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {t('webbios.cloudflareQuotas.d1.desc')}
            </p>
          </div>
        </div>

        {/* R2 Storage Quota */}
        <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-purple-500" />
              {t('webbios.cloudflareQuotas.r2.title')}
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="flex justify-between items-end mb-2">
              <div className="text-2xl font-bold">2.4 GB</div>
              <div className="text-sm text-gray-500">{t('webbios.cloudflareQuotas.r2.unit')}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              {t('webbios.cloudflareQuotas.r2.desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-orange-50 text-gray-950 shadow border-orange-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Zap className="h-6 w-6 text-orange-500 mt-1" />
            <div>
              <h3 className="font-medium text-orange-900">{t('webbios.cloudflareQuotas.upgrade.title')}</h3>
              <p className="mt-1 text-sm text-orange-800">
                {t('webbios.cloudflareQuotas.upgrade.desc')}
              </p>
              <Button 
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => window.open('https://dash.cloudflare.com', '_blank')}
              >
                {t('webbios.cloudflareQuotas.upgrade.button')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
