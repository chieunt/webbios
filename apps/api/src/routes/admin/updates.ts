import { Hono } from 'hono';

const app = new Hono();

app.post('/install', async (c) => {
  try {
    const body = await c.req.json();
    const { shopId, version, targetId, type } = body;

    if (!shopId || !version || !targetId || !type) {
      return c.json({ success: false, error: 'Missing required fields' }, 400);
    }

    // Call the God Platform API to enqueue the update job
    const platformApiUrl = 'https://platform.webbios.dev';
    
    // In a real production scenario, this call would include an Authorization header
    // with the Shop's License Key to verify the request on the Platform side.
    const response = await fetch(`${platformApiUrl}/api/v1/platform/shops/${shopId}/push-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        targetId,
        version,
        previousVersion: body.previousVersion
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return c.json({
        success: true,
        message: 'Update job queued successfully',
        jobId: data.jobId
      });
    } else {
      return c.json({
        success: false,
        error: data.error || 'Failed to queue update on platform'
      }, 500);
    }
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default app;
