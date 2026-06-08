import { vi } from './vi';
import { en } from './en';
import { ulid } from 'ulid';

export function getSeedSQL(lang: 'vi' | 'en' = 'vi'): string {
  const dict = lang === 'vi' ? vi : en;
  let sql = `-- WebbiOS Seed Data (${lang.toUpperCase()})\n\n`;

  // Helper to escape SQL strings
  const esc = (str: string | null) => str === null ? 'NULL' : `'${str.replace(/'/g, "''")}'`;

  // 1. Roles
  const ownerId = ulid();
  const adminId = ulid();
  const staffId = ulid();
  const customerId = ulid();

  sql += `-- ROLES\n`;
  sql += `INSERT INTO wb_roles (id, name, slug, description, is_system) VALUES\n`;
  sql += `(${esc(ownerId)}, ${esc(dict.roles.owner.name)}, 'owner', ${esc(dict.roles.owner.description)}, 1),\n`;
  sql += `(${esc(adminId)}, ${esc(dict.roles.admin.name)}, 'admin', ${esc(dict.roles.admin.description)}, 1),\n`;
  sql += `(${esc(staffId)}, ${esc(dict.roles.staff.name)}, 'staff', ${esc(dict.roles.staff.description)}, 1),\n`;
  sql += `(${esc(customerId)}, ${esc(dict.roles.customer.name)}, 'customer', ${esc(dict.roles.customer.description)}, 1);\n\n`;

  // 2. Permissions
  sql += `-- PERMISSIONS\n`;
  const perms = [
    { slug: 'dashboard:view', name: dict.permissions.dashboard_view, group: 'dashboard', sort: 1 },
    { slug: 'settings:view', name: dict.permissions.settings_view, group: 'settings', sort: 1 },
    { slug: 'settings:edit', name: dict.permissions.settings_edit, group: 'settings', sort: 2 },
    { slug: 'users:view', name: dict.permissions.users_view, group: 'users', sort: 1 },
    { slug: 'users:manage', name: dict.permissions.users_manage, group: 'users', sort: 2 },
    { slug: 'media:view', name: dict.permissions.media_view, group: 'media', sort: 1 },
    { slug: 'media:upload', name: dict.permissions.media_upload, group: 'media', sort: 2 },
    { slug: 'media:delete', name: dict.permissions.media_delete, group: 'media', sort: 3 },
    { slug: 'apps:view', name: dict.permissions.apps_view, group: 'apps', sort: 1 },
    { slug: 'apps:manage', name: dict.permissions.apps_manage, group: 'apps', sort: 2 },
    { slug: 'api_keys:view', name: dict.permissions.api_keys_view, group: 'api_keys', sort: 1 },
    { slug: 'api_keys:manage', name: dict.permissions.api_keys_manage, group: 'api_keys', sort: 2 },
    { slug: 'roles:view', name: dict.permissions.roles_view, group: 'system', sort: 1 },
    { slug: 'roles:manage', name: dict.permissions.roles_manage, group: 'system', sort: 2 },
    { slug: 'permissions:view', name: dict.permissions.permissions_view, group: 'system', sort: 3 },
    { slug: 'permissions:manage', name: dict.permissions.permissions_manage, group: 'system', sort: 4 },
    { slug: 'menus:view', name: dict.permissions.menus_view, group: 'system', sort: 5 },
    { slug: 'menus:manage', name: dict.permissions.menus_manage, group: 'system', sort: 6 },
    { slug: 'audit:view', name: dict.permissions.audit_view, group: 'audit', sort: 1 },
  ];

  const permMap: Record<string, string> = {};
  sql += `INSERT INTO wb_permissions (id, slug, name, group_name, sort_order) VALUES\n`;
  const permValues = perms.map(p => {
    const id = ulid();
    permMap[p.slug] = id;
    return `(${esc(id)}, ${esc(p.slug)}, ${esc(p.name)}, ${esc(p.group)}, ${p.sort})`;
  });
  sql += permValues.join(',\n') + ';\n\n';

  // 3. Role Permissions
  sql += `-- ROLE PERMISSIONS\n`;
  sql += `INSERT INTO wb_role_permissions (role_id, permission_id) VALUES\n`;
  const rolePerms: string[] = [];
  perms.forEach(p => {
    rolePerms.push(`(${esc(ownerId)}, ${esc(permMap[p.slug])})`);
    if (p.slug !== 'users:manage') {
      rolePerms.push(`(${esc(adminId)}, ${esc(permMap[p.slug])})`);
    }
    if (p.slug.endsWith(':view')) {
      rolePerms.push(`(${esc(staffId)}, ${esc(permMap[p.slug])})`);
    }
  });
  sql += rolePerms.join(',\n') + ';\n\n';

  // 4. Menus
  sql += `-- MENUS\n`;
  const appsMenuId = ulid();
  const systemMenuId = ulid();
  const webbiosMenuId = ulid();

  const menus = [
    { id: ulid(), parent: null, label: dict.menus.dashboard, icon: 'Home', path: '/', perm: 'dashboard:view', sort: 1, isCat: 0 },
    { id: ulid(), parent: null, label: dict.menus.media, icon: 'Image', path: '/media', perm: 'media:view', sort: 2, isCat: 0 },
    
    { id: appsMenuId, parent: null, label: dict.menus.apps_category, icon: null, path: '', perm: null, sort: 5, isCat: 1 },
    { id: ulid(), parent: appsMenuId, label: dict.menus.installed_apps, icon: 'Package', path: '/apps', perm: 'apps:view', sort: 6, isCat: 0 },
    { id: ulid(), parent: appsMenuId, label: dict.menus.apps_store, icon: 'Grid', path: '/apps/store', perm: 'apps:view', sort: 7, isCat: 0 },
    
    { id: systemMenuId, parent: null, label: dict.menus.system_category, icon: null, path: '', perm: null, sort: 10, isCat: 1 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.users, icon: 'Users', path: '/users', perm: 'users:view', sort: 11, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.menus, icon: 'Menu', path: '/system/menus', perm: 'menus:view', sort: 12, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.roles, icon: 'Shield', path: '/system/roles', perm: 'roles:view', sort: 13, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.permissions, icon: 'Lock', path: '/system/permissions', perm: 'permissions:view', sort: 14, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.audit, icon: 'FileText', path: '/audit', perm: 'audit:view', sort: 15, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.settings, icon: 'Settings', path: '/settings', perm: 'settings:view', sort: 16, isCat: 0 },
    { id: ulid(), parent: systemMenuId, label: dict.menus.api_keys, icon: 'Key', path: '/api-keys', perm: 'api_keys:view', sort: 17, isCat: 0 },

    { id: webbiosMenuId, parent: null, label: dict.menus.webbios_category, icon: null, path: '', perm: null, sort: 20, isCat: 1 },
    { id: ulid(), parent: webbiosMenuId, label: dict.menus.license, icon: 'Circle', path: '/webbios/licenses', perm: null, sort: 21, isCat: 0 },
    { id: ulid(), parent: webbiosMenuId, label: dict.menus.updates, icon: 'CloudUpload', path: '/webbios/updates', perm: null, sort: 22, isCat: 0 },
  ];

  sql += `INSERT INTO wb_menus (id, parent_id, label, icon, path, permission_slug, position, is_system, translations) VALUES\n`;
  const menuValues = menus.map(m => {
    // translations json
    const trans = JSON.stringify({
      vi: m.isCat ? vi.menus[Object.keys(dict.menus).find(k => dict.menus[k as keyof typeof dict.menus] === m.label) as keyof typeof vi.menus] : undefined,
      en: m.isCat ? en.menus[Object.keys(dict.menus).find(k => dict.menus[k as keyof typeof dict.menus] === m.label) as keyof typeof en.menus] : undefined,
      isCategory: m.isCat === 1
    });
    return `(${esc(m.id)}, ${esc(m.parent)}, ${esc(m.label)}, ${esc(m.icon)}, ${esc(m.path)}, ${esc(m.perm)}, ${m.sort}, 1, ${esc(trans)})`;
  });
  sql += menuValues.join(',\n') + ';\n\n';

  // 5. Admin User (Owner)
  sql += `-- ADMIN USER\n`;
  const adminUserId = ulid();
  // Hash for 'password123' used globally in WebbiOS
  const passwordHash = '79cc643099214bc7f013265f6f2a757e:4241edfa8e52f23dd86e79dc386ee0f902eb61a83641ba0a1c64a620fb2fd21f';
  sql += `INSERT INTO wb_users (id, email, password_hash, first_name, last_name, role_id, status) VALUES\n`;
  sql += `(${esc(adminUserId)}, 'admin@webbios.local', ${esc(passwordHash)}, 'Webbi', 'Admin', ${esc(ownerId)}, 'active');\n\n`;

  // 6. Settings
  sql += `-- SETTINGS\n`;
  sql += `INSERT INTO wb_settings ("key", "value", group_name) VALUES\n`;
  sql += `('site.name', '"My WebbiOS Site"', 'site'),\n`;
  sql += `('site.description', '"Powered by WebbiOS"', 'site'),\n`;
  sql += `('site.locale', '"${lang}"', 'site'),\n`;
  sql += `('site.timezone', '"Asia/Ho_Chi_Minh"', 'site'),\n`;
  sql += `('site.currency', '"VND"', 'site'),\n`;
  sql += `('system.version', '"2.0.0"', 'system');\n\n`;

  return sql;
}
