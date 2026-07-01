import { ulid } from 'ulidx';

export async function logAction(
  db: any,
  userId: string | undefined,
  action: 'create' | 'update' | 'delete' | 'restore',
  resourceType: string,
  resourceId: string,
  resourceTitle: string | null,
  changes: any | null,
  route: string,
  method: string,
  ipAddress: string | null = null,
  userAgent: string | null = null
) {
  const id = ulid();
  const query = `
    INSERT INTO wb_audit_logs (id, user_id, action, resource_type, resource_id, resource_title, changes, route, method, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await db.prepare(query).bind(
      id,
      userId || null,
      action,
      resourceType,
      resourceId,
      resourceTitle,
      changes ? JSON.stringify(changes) : null,
      route,
      method,
      ipAddress,
      userAgent
    ).run();
  } catch (e) {
    console.error('Failed to log audit action:', e);
  }
}
