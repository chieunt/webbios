import { Hono } from 'hono';
import { Env } from '../../bindings';

const app = new Hono<{ Bindings: Env }>();

const PLATFORM_API_URL = 'https://platform.webbios.dev';

// Helper: Scan R2 removed. Platform API now returns latestVersion and version.

// Get apps from marketplace (enriched with latestVersion from R2)
app.get('/apps', async (c) => {
  try {
    const res = await fetch(`${PLATFORM_API_URL}/api/v1/platform/marketplace/apps`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Platform API responded with status ${res.status}`);
    }

    const data: any = await res.json();
    const apps: any[] = data.success && data.data ? data.data : [];

    // Platform API now directly returns latestVersion via JOIN
    const enriched = apps.map((storeApp) => {
      return {
        ...storeApp,
        // Ensure version aliases exist
        latestVersion: storeApp.latestVersion || storeApp.version || null,
        version: storeApp.latestVersion || storeApp.version || null,
      };
    });

    return c.json({ success: true, data: enriched });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
