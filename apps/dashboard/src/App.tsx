import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/products/ProductsPage';
import { webbios, resolveApiUrl } from './api';
import i18n from './i18n';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Loading } from '@webbios/ui';

// --- Simple Auth Context ---
interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  permissions: string[];
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  permissions: [],
  login: () => {},
  logout: () => {},
  refreshUser: async () => {}
});

export const useAuth = () => useContext(AuthContext);

import MenusPage from './pages/system/MenusPage';
import PermissionsPage from './pages/system/PermissionsPage';
import { lazy, Suspense } from 'react';
import RolesPage from './pages/system/RolesPage';
import { UpdatesPage } from './pages/WebbiOS/UpdatesPage';
import { BackupRestorePage } from './pages/WebbiOS/BackupRestorePage';
import { CloudflareQuotasPage } from './pages/WebbiOS/CloudflareQuotasPage';

// Remote Modules
const PlatformShopsPage = lazy(() => import('platformSuite/ShopsPage'));
const PlatformLicensesPage = lazy(() => import('platformSuite/LicensesPage'));
const PlatformVersionsPage = lazy(() => import('platformSuite/VersionsPage'));
import MediaPage from './pages/media/MediaPage';
import AppsPage from './pages/apps/AppsPage';
import AppsStorePage from './pages/apps/AppsStorePage';
import UsersPage from './pages/system/UsersPage';
import AuditLogsPage from './pages/system/AuditLogsPage';
import CronJobsPage from './pages/system/CronJobsPage';
import SettingsPage from './pages/system/SettingsPage';
import DomainsPage from './pages/system/DomainsPage';
import WebhooksPage from './pages/system/WebhooksPage';
import ApiKeysPage from './pages/system/ApiKeysPage';
import AccountPage from './pages/AccountPage';
import AppContainer from './pages/apps/AppContainer';

// --- Protected Route ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('webbios_token'));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('webbios_token'));
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Get public settings (language) before rendering app
        const publicEndpoint = resolveApiUrl().replace('/v1/admin', '/v1/public/settings');
        const res = await fetch(publicEndpoint);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data['site.language']) {
            let lang = json.data['site.language'];
            if (typeof lang === 'string' && lang.startsWith('"')) {
              try { lang = JSON.parse(lang); } catch (e) {}
            }
            i18n.changeLanguage(lang);
          }
        }
      } catch (err) {
        console.error('Failed to load public settings', err);
      }

      if (token) {
        await fetchUserInfo(token);
      } else {
        setIsInitializing(false);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    const handleForceLogout = () => logout();
    window.addEventListener('auth:logout', handleForceLogout);
    
    // Configure WebbiSDK to trigger this event on 401
    webbios.onAuthError(handleForceLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleForceLogout);
    };
  }, []);

  const fetchUserInfo = async (t: string) => {
    try {
      webbios.setToken(t);
      const res = await webbios.auth.me();
      
      setUser(res.user);
      setPermissions(res.permissions || []);
    } catch (err) {
      console.error('Failed to fetch user info', err);
      logout();
    } finally {
      setIsInitializing(false);
    }
  };

  const refreshUser = async () => {
    if (token) await fetchUserInfo(token);
  };

  const login = (newToken: string) => {
    localStorage.setItem('webbios_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    fetchUserInfo(newToken);
  };

  const logout = () => {
    localStorage.removeItem('webbios_token');
    setToken(null);
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  };

  if (isInitializing) {
    return <Loading fullScreen text={t('common.messages.initializingSystem', 'Initializing system...')} />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, permissions, login, logout, refreshUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <div className="p-6">Orders Page</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customers" 
            element={
              <ProtectedRoute>
                <div className="p-6">Customers Page</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings/security" 
            element={
              <ProtectedRoute>
                <div className="p-6">Security Settings Placeholder</div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/system/menus" 
            element={
              <ProtectedRoute>
                <MenusPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/system/permissions" 
            element={
              <ProtectedRoute>
                <PermissionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/system/roles" 
            element={
              <ProtectedRoute>
                <RolesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/platform/licenses" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading className="py-20" text={t('common.messages.loadingData', 'Loading data...')} />}>
                  <div id="remote-platform" className="h-full">
                    <PlatformLicensesPage />
                  </div>
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/platform/shops" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading className="py-20" text={t('common.messages.loadingData', 'Loading data...')} />}>
                  <div id="remote-platform" className="h-full">
                    <PlatformShopsPage />
                  </div>
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/platform/versions" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loading className="py-20" text={t('common.messages.loadingData', 'Loading data...')} />}>
                  <div id="remote-platform" className="h-full">
                    <PlatformVersionsPage />
                  </div>
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/webbios/updates" 
            element={
              <ProtectedRoute>
                <UpdatesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/webbios/backup-restore" 
            element={<ProtectedRoute><BackupRestorePage /></ProtectedRoute>} 
          />
          <Route 
            path="/webbios/cloudflare-quotas" 
            element={<ProtectedRoute><CloudflareQuotasPage /></ProtectedRoute>} 
          />
          <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
          <Route path="/apps" element={<ProtectedRoute><AppsPage /></ProtectedRoute>} />
          <Route path="/apps/store" element={<ProtectedRoute><AppsStorePage /></ProtectedRoute>} />
          <Route path="/apps/:appSlug/*" element={<ProtectedRoute><AppContainer /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
          <Route path="/system/cron-jobs" element={<ProtectedRoute><CronJobsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/settings/domains" element={<ProtectedRoute><DomainsPage /></ProtectedRoute>} />
          <Route path="/settings/webhooks" element={<ProtectedRoute><WebhooksPage /></ProtectedRoute>} />
          <Route path="/api-keys" element={<ProtectedRoute><ApiKeysPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
