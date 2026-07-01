import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { webbios } from '../../api';
import RemoteAppLoader from '../../components/RemoteAppLoader';

export default function AppContainer() {
  const { t } = useTranslation();
  const params = useParams<{ appSlug: string, '*': string }>();
  const appSlug = params.appSlug;
  const subPath = params['*'] || '';
  const [appInfo, setAppInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApp() {
      if (!appSlug) return;
      try {
        setLoading(true);
        const res = await webbios.client.get('/apps');
        const apps = res.data || [];
        const app = apps.find((a: any) => a.slug === appSlug);
        
        if (app) {
          setAppInfo(app);
        } else {
          setError(t('apps.container.notFound', 'App not found or not installed.'));
        }
      } catch (err: any) {
        setError(err.message || t('apps.container.errorFetching', 'Error fetching app info'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchApp();
  }, [appSlug]);

  if (loading) {
    return <div className="p-6 text-gray-500">{t('apps.container.checking', 'Checking app...')}</div>;
  }

  if (error || !appInfo) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!appInfo.workerUrl) {
    return <div className="p-6 text-red-600">{t('apps.container.noWorkerUrl', 'App has no URL (workerUrl) provided. Please reconfigure.')}</div>;
  }

  // Determine module to load based on subPath
  // Each app defines its own exposed modules via Module Federation
  const getModuleName = (slug: string, path: string): string => {
    const route = path.split('/')[0];
    if (slug === 'crm') {
      if (path === 'orders/create') return './CreateOrderPage';
      if (route === 'customers') return './CustomersPage';
      if (route === 'reports') return './ReportsPage';
      if (route === 'products') return './ProductsPage';
      if (route === 'inventory') return './InventoryPage';
      if (route === 'purchase_orders') return './PurchaseOrdersPage';
      if (route === 'suppliers') return './SuppliersPage';
      if (route === 'vendors') return './VendorsPage';
      // Default (no path or 'orders'): OrdersPage
      return './OrdersPage';
    }
    if (slug === 'theme-manager') {
      if (route === 'ThemeBuilderPage') return './ThemeBuilderPage';
      return './ThemesPage';
    }
    // For other apps, try to load a generic './App' module
    return './App';
  };

  const moduleName = getModuleName(appSlug || '', subPath);

  return (
    <div className="h-full w-full">
      <RemoteAppLoader 
        key={`${appInfo.slug}-${moduleName}`}
        appSlug={appInfo.slug} 
        workerUrl={appInfo.workerUrl} 
        moduleName={moduleName} 
      />
    </div>
  );
}
