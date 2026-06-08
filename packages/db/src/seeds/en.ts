export const en = {
  roles: {
    owner: { name: 'Owner', description: 'Full access. Cannot be deleted or revoked.' },
    admin: { name: 'Administrator', description: 'Almost full access. Cannot manage Owner.' },
    staff: { name: 'Staff', description: 'View and process tasks based on assigned permissions.' },
    customer: { name: 'Customer', description: 'Customer account registered from storefront.' }
  },
  permissions: {
    dashboard_view: 'View dashboard',
    settings_view: 'View settings',
    settings_edit: 'Edit settings',
    users_view: 'View users',
    users_manage: 'Manage users',
    media_view: 'View media library',
    media_upload: 'Upload files',
    media_delete: 'Delete files',
    apps_view: 'View apps',
    apps_manage: 'Install/Uninstall apps',
    api_keys_view: 'View API keys',
    api_keys_manage: 'Manage API keys',
    roles_view: 'View roles',
    roles_manage: 'Manage roles',
    permissions_view: 'View permissions',
    permissions_manage: 'Manage permissions',
    menus_view: 'View menus',
    menus_manage: 'Manage menus',
    audit_view: 'View audit logs'
  },
  menus: {
    dashboard: 'Dashboard',
    media: 'Media Library',
    apps_category: 'APPS',
    installed_apps: 'Installed Apps',
    apps_store: 'Apps Store',
    system_category: 'SYSTEM',
    users: 'Users',
    menus: 'Menus',
    roles: 'Roles',
    permissions: 'Permissions',
    audit: 'Audit Logs',
    settings: 'Settings',
    api_keys: 'API Keys',
    webbios_category: 'WEBBIOS',
    license: 'License',
    updates: 'Updates'
  }
};
