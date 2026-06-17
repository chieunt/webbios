import { WebbiSDK } from '@webbios/sdk';

export const resolveApiUrl = () => {
  // 1. Prioritize hardcoded env variables (like .env.production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  const hostname = window.location.hostname;

  // 2. Local environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8787/v1/admin';
  }

  // 3. Production environment (Domain Convention)
  // Trial users: admin.shop1.webbi.vn -> api.shop1.webbi.vn
  // Custom domain users: admin.domain.com -> api.domain.com
  if (hostname.startsWith('admin.')) {
    return `https://${hostname.replace('admin.', 'api.')}/v1/admin`;
  }

  // 4. Cloudflare Development environment (Shared with preview branches)
  if (hostname.endsWith('.pages.dev')) {
    // Extract shopId from domain: webbios-dashboard-wbshop9050.pages.dev
    const parts = hostname.split('.');
    // If format is hash.webbios-dashboard-xxx.pages.dev take [1], else [0]
    const projectDomain = parts.length > 3 ? parts[1] : parts[0];
    
    if (projectDomain.startsWith('webbios-dashboard-')) {
      const shopId = projectDomain.replace('webbios-dashboard-', '');
      return `https://webbios-api-${shopId}.chieunt.workers.dev/v1/admin`;
    }
    
    if (projectDomain === 'webbios-dashboard') {
      return 'https://webbios-api.webbios-developers.workers.dev/v1/admin';
    }

    return 'https://webbios-api.webbios-developers.workers.dev/v1/admin';
  }

  // Safe fallback if rules do not match
  return 'http://127.0.0.1:8787/v1/admin';
};

export const webbios = new WebbiSDK({
  endpoint: resolveApiUrl()
});