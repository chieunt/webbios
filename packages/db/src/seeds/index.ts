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
    { slug: 'dashboard:view', key: 'dashboard_view', group: 'dashboard', sort: 1 },
    { slug: 'settings:view', key: 'settings_view', group: 'settings', sort: 1 },
    { slug: 'settings:edit', key: 'settings_edit', group: 'settings', sort: 2 },
    { slug: 'users:view', key: 'users_view', group: 'users', sort: 1 },
    { slug: 'users:manage', key: 'users_manage', group: 'users', sort: 2 },
    { slug: 'media:view', key: 'media_view', group: 'media', sort: 1 },
    { slug: 'media:upload', key: 'media_upload', group: 'media', sort: 2 },
    { slug: 'media:delete', key: 'media_delete', group: 'media', sort: 3 },
    { slug: 'apps:view', key: 'apps_view', group: 'apps', sort: 1 },
    { slug: 'apps:manage', key: 'apps_manage', group: 'apps', sort: 2 },
    { slug: 'api_keys:view', key: 'api_keys_view', group: 'api_keys', sort: 1 },
    { slug: 'api_keys:manage', key: 'api_keys_manage', group: 'api_keys', sort: 2 },
    { slug: 'roles:view', key: 'roles_view', group: 'system', sort: 1 },
    { slug: 'roles:manage', key: 'roles_manage', group: 'system', sort: 2 },
    { slug: 'permissions:view', key: 'permissions_view', group: 'system', sort: 3 },
    { slug: 'permissions:manage', key: 'permissions_manage', group: 'system', sort: 4 },
    { slug: 'menus:view', key: 'menus_view', group: 'system', sort: 5 },
    { slug: 'menus:manage', key: 'menus_manage', group: 'system', sort: 6 },
    { slug: 'audit:view', key: 'audit_view', group: 'audit', sort: 1 },
  ];

  const permMap: Record<string, string> = {};
  sql += `INSERT INTO wb_permissions (id, slug, name, group_name, sort_order, translations) VALUES\n`;
  const permValues = perms.map(p => {
    const id = ulid();
    permMap[p.slug] = id;
    const nameEn = en.permissions[p.key as keyof typeof en.permissions];
    const trans = JSON.stringify({
      vi: vi.permissions[p.key as keyof typeof vi.permissions],
      en: nameEn
    });
    return `(${esc(id)}, ${esc(p.slug)}, ${esc(nameEn)}, ${esc(p.group)}, ${p.sort}, ${esc(trans)})`;
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
  const storefrontMenuId = ulid();
  const webbiosMenuId = ulid();

  const securityMenuId = ulid();
  const advancedMenuId = ulid();
  const settingsMenuId = ulid();

  const menus = [
    // Top Level
    { id: ulid(), parent: null, label: dict.menus.dashboard, icon: 'Home', path: '/', perm: 'dashboard:view', sort: 1, isCat: 0 },

    // Storefront Category
    { id: storefrontMenuId, parent: null, label: dict.menus.storefront_category, icon: null, path: '', perm: null, sort: 2, isCat: 1 },
    { id: ulid(), parent: storefrontMenuId, label: dict.menus.media, icon: 'Image', path: '/media', perm: 'media:view', sort: 1, isCat: 0 },

    // Apps Category
    { id: appsMenuId, parent: null, label: dict.menus.apps_category, icon: null, path: '', perm: null, sort: 5, isCat: 1 },
    { id: ulid(), parent: appsMenuId, label: dict.menus.installed_apps, icon: 'Package', path: '/apps', perm: 'apps:view', sort: 1, isCat: 0 },
    { id: ulid(), parent: appsMenuId, label: dict.menus.apps_store, icon: 'Grid', path: '/apps/store', perm: 'apps:view', sort: 2, isCat: 0 },

    // System Category
    { id: systemMenuId, parent: null, label: dict.menus.system_category, icon: null, path: '', perm: null, sort: 10, isCat: 1 },

    // System > Security
    { id: securityMenuId, parent: systemMenuId, label: dict.menus.system_security, icon: 'ShieldCheck', path: '', perm: null, sort: 1, isCat: 0 },
    { id: ulid(), parent: securityMenuId, label: dict.menus.users, icon: 'Users', path: '/users', perm: 'users:view', sort: 1, isCat: 0 },
    { id: ulid(), parent: securityMenuId, label: dict.menus.roles, icon: 'Shield', path: '/system/roles', perm: 'roles:view', sort: 2, isCat: 0 },
    { id: ulid(), parent: securityMenuId, label: dict.menus.permissions, icon: 'Lock', path: '/system/permissions', perm: 'permissions:view', sort: 3, isCat: 0 },
    { id: ulid(), parent: securityMenuId, label: dict.menus.api_keys, icon: 'Key', path: '/api-keys', perm: 'api_keys:view', sort: 4, isCat: 0 },

    // System > Advanced
    { id: advancedMenuId, parent: systemMenuId, label: dict.menus.system_advanced, icon: 'TerminalSquare', path: '', perm: null, sort: 2, isCat: 0 },
    { id: ulid(), parent: advancedMenuId, label: dict.menus.menus, icon: 'Menu', path: '/system/menus', perm: 'menus:view', sort: 1, isCat: 0 },
    { id: ulid(), parent: advancedMenuId, label: dict.menus.audit, icon: 'FileText', path: '/audit', perm: 'audit:view', sort: 2, isCat: 0 },
    { id: ulid(), parent: advancedMenuId, label: dict.menus.cron_jobs, icon: 'Clock', path: '/system/cron-jobs', perm: 'settings:view', sort: 3, isCat: 0 },

    // System > Settings
    { id: settingsMenuId, parent: systemMenuId, label: dict.menus.system_settings, icon: 'Settings', path: '', perm: 'settings:view', sort: 3, isCat: 0 },
    { id: ulid(), parent: settingsMenuId, label: dict.menus.settings_system, icon: null, path: '/settings', perm: 'settings:view', sort: 1, isCat: 0 },
    { id: ulid(), parent: settingsMenuId, label: dict.menus.settings_domains, icon: null, path: '/settings/domains', perm: 'settings:view', sort: 2, isCat: 0 },
    { id: ulid(), parent: settingsMenuId, label: dict.menus.settings_webhooks, icon: null, path: '/settings/webhooks', perm: 'settings:view', sort: 3, isCat: 0 },

    // WebbiOS Category
    { id: webbiosMenuId, parent: null, label: dict.menus.webbios_category, icon: null, path: '', perm: null, sort: 20, isCat: 1 },
    { id: ulid(), parent: webbiosMenuId, label: dict.menus.backup_restore, icon: 'DatabaseBackup', path: '/webbios/backup-restore', perm: null, sort: 1, isCat: 0 },
    { id: ulid(), parent: webbiosMenuId, label: dict.menus.cloudflare_quotas, icon: 'PieChart', path: '/webbios/cloudflare-quotas', perm: null, sort: 2, isCat: 0 },
    { id: ulid(), parent: webbiosMenuId, label: dict.menus.updates, icon: 'CloudUpload', path: '/webbios/updates', perm: null, sort: 3, isCat: 0 },
  ];

  sql += `INSERT INTO wb_menus (id, parent_id, label, icon, path, permission_slug, position, is_system, translations) VALUES\n`;
  const menuValues = menus.map(m => {
    // translations json
    const key = Object.keys(dict.menus).find(k => dict.menus[k as keyof typeof dict.menus] === m.label);
    const trans = JSON.stringify({
      vi: key ? vi.menus[key as keyof typeof vi.menus] : m.label,
      en: key ? en.menus[key as keyof typeof en.menus] : m.label,
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
  sql += `('site.country', '"VN"', 'site'),\n`;
  sql += `('site.timezone', '"Asia/Ho_Chi_Minh"', 'site'),\n`;
  sql += `('site.currency', '"VND"', 'site'),\n`;
  sql += `('site.active_languages', '"[{\\"code\\":\\"vi\\",\\"is_default\\":true}]"', 'site'),\n`;
  sql += `('system.version', '"1.0.0"', 'system');\n\n`;

  // 7. Languages
  sql += `-- LANGUAGES\n`;
  const languages = [
    { code: 'vi', name: 'Tiếng Việt', native: 'Tiếng Việt', flag: 'vn' },
    { code: 'en', name: 'English', native: 'English', flag: 'us' },
    { code: 'fr', name: 'French', native: 'Français', flag: 'fr' },
    { code: 'de', name: 'German', native: 'Deutsch', flag: 'de' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: 'jp' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: 'kr' },
    { code: 'zh', name: 'Chinese', native: '中文', flag: 'cn' }
  ];
  sql += `INSERT INTO wb_languages (code, name, native_name, flag, is_active) VALUES\n`;
  const langValues = languages.map(l => `(${esc(l.code)}, ${esc(l.name)}, ${esc(l.native)}, ${esc(l.flag)}, 1)`);
  sql += langValues.join(',\n') + ';\n\n';

  return sql;
}
