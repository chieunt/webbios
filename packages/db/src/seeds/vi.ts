export const vi = {
  roles: {
    owner: { name: 'Chủ sở hữu', description: 'Toàn quyền. Không thể xóa hoặc thu hồi quyền.' },
    admin: { name: 'Quản trị viên', description: 'Gần toàn quyền. Không thể quản lý Owner.' },
    staff: { name: 'Nhân viên', description: 'Xem/xử lý tác vụ theo quyền được gán.' },
    customer: { name: 'Khách hàng', description: 'Tài khoản khách hàng đăng ký từ storefront.' }
  },
  permissions: {
    dashboard_view: 'Xem tổng quan',
    settings_view: 'Xem cài đặt',
    settings_edit: 'Sửa cài đặt',
    users_view: 'Xem người dùng',
    users_manage: 'Quản lý người dùng',
    media_view: 'Xem thư viện media',
    media_upload: 'Upload file',
    media_delete: 'Xóa file',
    apps_view: 'Xem ứng dụng',
    apps_manage: 'Cài đặt/Gỡ ứng dụng',
    api_keys_view: 'Xem API keys',
    api_keys_manage: 'Quản lý API keys',
    roles_view: 'Xem vai trò',
    roles_manage: 'Quản lý vai trò',
    permissions_view: 'Xem quyền',
    permissions_manage: 'Quản lý quyền',
    menus_view: 'Xem menu',
    menus_manage: 'Quản lý menu',
    audit_view: 'Xem nhật ký hoạt động'
  },
  menus: {
    dashboard: 'Tổng quan',
    media: 'Thư viện media',
    apps_category: 'KHO ỨNG DỤNG',
    installed_apps: 'Đã cài đặt',
    apps_store: 'Kho ứng dụng',
    system_category: 'HỆ THỐNG',
    users: 'Người dùng',
    menus: 'Menu',
    roles: 'Vai trò',
    permissions: 'Phân quyền',
    audit: 'Nhật ký',
    settings: 'Cài đặt',
    api_keys: 'API Keys',
    webbios_category: 'WEBBIOS',
    license: 'Bản quyền',
    updates: 'Cập nhật'
  }
};
