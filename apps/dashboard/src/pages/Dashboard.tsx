import { Users, DollarSign, ShoppingCart, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@webbios/ui';
import { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { webbios } from '../api';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await webbios.dashboard.stats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  return (
    <div className="space-y-6 font-sans">
      <div className="text-sm text-cf-gray-text font-medium">{t('dashboard.accountHome')}</div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-cf-text tracking-tight">
          {t('dashboard.welcome', { name: user?.name || user?.email || 'Admin' })}
        </h1>
        <div className="flex items-center space-x-3">
          <Button variant="primary">
            <span>{t('dashboard.createReport')}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <h2 className="text-lg font-semibold text-cf-text">{t('dashboard.ecommerceOverview')}</h2>
      </div>

      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-32 bg-cf-border rounded w-full"></div>
          <div className="h-32 bg-cf-border rounded w-full"></div>
          <div className="h-32 bg-cf-border rounded w-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Revenue Card */}
          <div className="bg-surface border border-cf-border rounded-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-cf-border flex items-center space-x-2 text-sm font-medium text-cf-gray-text">
              <DollarSign size={16} />
              <span>{t('dashboard.revenue')}</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="text-2xl font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-surface border border-cf-border rounded-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-cf-border flex items-center space-x-2 text-sm font-medium text-cf-gray-text">
              <ShoppingCart size={16} />
              <span>{t('dashboard.orders')}</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="text-2xl font-semibold">{stats?.totalOrders || 0}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-surface border border-cf-border rounded-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-cf-border flex items-center space-x-2 text-sm font-medium text-cf-gray-text">
              <Users size={16} />
              <span>{t('dashboard.customers')}</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="text-2xl font-semibold">{stats?.totalCustomers || 0}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-surface border border-cf-border rounded-lg overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-cf-border flex items-center space-x-2 text-sm font-medium text-cf-gray-text">
              <Package size={16} />
              <span>{t('dashboard.products')}</span>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
              <div className="text-2xl font-semibold">{stats?.totalProducts || 0}</div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
