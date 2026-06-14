import { Hono } from 'hono';
import { CacheService } from '../../services/cache';

// Mock types until we add them to @webbios/db
type Bindings = {
  DB: D1Database;
  CACHE_KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

// Lấy config của theme đang active cho domain
app.get('/:domain', async (c) => {
  const domain = c.req.param('domain');
  
  const cache = new CacheService(c.env.CACHE_KV, '', '');
  const themeData = await cache.get(`theme:config:${domain}`);
  
  if (themeData) {
    return c.json({
      success: true,
      data: themeData
    });
  }

  return c.json({
    success: false,
    message: 'Theme not found for this domain'
  }, 404);
});

// Cập nhật/Publish config theme cho domain
app.post('/:domain', async (c) => {
  const domain = c.req.param('domain');
  const payload = await c.req.json();
  
  const cache = new CacheService(c.env.CACHE_KV, '', '');
  await cache.set(`theme:config:${domain}`, payload);
  
  // Clear CDN cache only (do not delete KV since it is primary storage)
  // await cache.purgeCDN(`storefront:${domain}`);

  return c.json({
    success: true,
    message: 'Theme published successfully'
  });
});

export default app;
