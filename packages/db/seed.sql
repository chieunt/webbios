-- WebbiOS Seed Data (VI)

-- ROLES
INSERT INTO wb_roles (id, name, slug, description, is_system) VALUES
('01KV9ZM4DA7SW1G5HCK1EDXF47', 'Chủ sở hữu', 'owner', 'Toàn quyền. Không thể xóa hoặc thu hồi quyền.', 1),
('01KV9ZM4DCFV15CJF5DZDA4PB1', 'Quản trị viên', 'admin', 'Gần toàn quyền. Không thể quản lý Owner.', 1),
('01KV9ZM4DCD1RNNVWRTH96D1TS', 'Nhân viên', 'staff', 'Xem/xử lý tác vụ theo quyền được gán.', 1),
('01KV9ZM4DC076RWW0E6B2BPNDX', 'Khách hàng', 'customer', 'Tài khoản khách hàng đăng ký từ storefront.', 1);

-- PERMISSIONS
INSERT INTO wb_permissions (id, slug, name, group_name, sort_order) VALUES
('01KV9ZM4DC6Y9E2QPKFJ4EHGE4', 'dashboard:view', 'Xem tổng quan', 'dashboard', 1),
('01KV9ZM4DCG3K3TAKJFD9GH2KW', 'settings:view', 'Xem cài đặt', 'settings', 1),
('01KV9ZM4DC2WMB4P33XSQNC4T4', 'settings:edit', 'Sửa cài đặt', 'settings', 2),
('01KV9ZM4DCTKZHNGGHNJNS3X38', 'users:view', 'Xem người dùng', 'users', 1),
('01KV9ZM4DC9MQFQJVHQNGZF6W4', 'users:manage', 'Quản lý người dùng', 'users', 2),
('01KV9ZM4DDY9JZWHCP1R50ZQET', 'media:view', 'Xem thư viện media', 'media', 1),
('01KV9ZM4DD4QYFM513AG5TKRNY', 'media:upload', 'Upload file', 'media', 2),
('01KV9ZM4DDJ2354NFBYZPY1PX8', 'media:delete', 'Xóa file', 'media', 3),
('01KV9ZM4DDPF8BS8M0GTPHMFQJ', 'apps:view', 'Xem ứng dụng', 'apps', 1),
('01KV9ZM4DDJ24PB45PXD6M8JH0', 'apps:manage', 'Cài đặt/Gỡ ứng dụng', 'apps', 2),
('01KV9ZM4DDDFE5PHVQ264BDBKM', 'api_keys:view', 'Xem API keys', 'api_keys', 1),
('01KV9ZM4DDW7TGGMR17C8PASKD', 'api_keys:manage', 'Quản lý API keys', 'api_keys', 2),
('01KV9ZM4DD44HY9JH7EC49KPP8', 'roles:view', 'Xem vai trò', 'system', 1),
('01KV9ZM4DDK8PADYJKCDWVN8GP', 'roles:manage', 'Quản lý vai trò', 'system', 2),
('01KV9ZM4DDPP568JPXA3GZ84HB', 'permissions:view', 'Xem quyền', 'system', 3),
('01KV9ZM4DDFE7WQFNH18Z9ZEN0', 'permissions:manage', 'Quản lý quyền', 'system', 4),
('01KV9ZM4DE8RYZT8HVECNHZNFM', 'menus:view', 'Xem menu', 'system', 5),
('01KV9ZM4DEB5QGK9A87JYRB89G', 'menus:manage', 'Quản lý menu', 'system', 6),
('01KV9ZM4DE98Z8B69X8QGCEC0H', 'audit:view', 'Xem nhật ký hoạt động', 'audit', 1);

-- ROLE PERMISSIONS
INSERT INTO wb_role_permissions (role_id, permission_id) VALUES
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DC6Y9E2QPKFJ4EHGE4'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DC6Y9E2QPKFJ4EHGE4'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DC6Y9E2QPKFJ4EHGE4'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DCG3K3TAKJFD9GH2KW'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DCG3K3TAKJFD9GH2KW'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DCG3K3TAKJFD9GH2KW'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DC2WMB4P33XSQNC4T4'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DC2WMB4P33XSQNC4T4'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DCTKZHNGGHNJNS3X38'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DCTKZHNGGHNJNS3X38'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DCTKZHNGGHNJNS3X38'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DC9MQFQJVHQNGZF6W4'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDY9JZWHCP1R50ZQET'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDY9JZWHCP1R50ZQET'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DDY9JZWHCP1R50ZQET'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DD4QYFM513AG5TKRNY'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DD4QYFM513AG5TKRNY'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDJ2354NFBYZPY1PX8'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDJ2354NFBYZPY1PX8'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDPF8BS8M0GTPHMFQJ'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDPF8BS8M0GTPHMFQJ'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DDPF8BS8M0GTPHMFQJ'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDJ24PB45PXD6M8JH0'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDJ24PB45PXD6M8JH0'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDDFE5PHVQ264BDBKM'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDDFE5PHVQ264BDBKM'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DDDFE5PHVQ264BDBKM'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDW7TGGMR17C8PASKD'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDW7TGGMR17C8PASKD'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DD44HY9JH7EC49KPP8'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DD44HY9JH7EC49KPP8'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DD44HY9JH7EC49KPP8'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDK8PADYJKCDWVN8GP'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDK8PADYJKCDWVN8GP'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDPP568JPXA3GZ84HB'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDPP568JPXA3GZ84HB'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DDPP568JPXA3GZ84HB'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DDFE7WQFNH18Z9ZEN0'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DDFE7WQFNH18Z9ZEN0'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DE8RYZT8HVECNHZNFM'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DE8RYZT8HVECNHZNFM'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DE8RYZT8HVECNHZNFM'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DEB5QGK9A87JYRB89G'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DEB5QGK9A87JYRB89G'),
('01KV9ZM4DA7SW1G5HCK1EDXF47', '01KV9ZM4DE98Z8B69X8QGCEC0H'),
('01KV9ZM4DCFV15CJF5DZDA4PB1', '01KV9ZM4DE98Z8B69X8QGCEC0H'),
('01KV9ZM4DCD1RNNVWRTH96D1TS', '01KV9ZM4DE98Z8B69X8QGCEC0H');

-- MENUS
INSERT INTO wb_menus (id, parent_id, label, icon, path, permission_slug, position, is_system, translations) VALUES
('01KV9ZM4DFVJXFNNS7BJV6VQRZ', NULL, 'Tổng quan', 'Home', '/', 'dashboard:view', 1, 1, '{"vi":"Tổng quan","en":"Dashboard","isCategory":false}'),
('01KV9ZM4DETR0YJDYRPR5CJD37', NULL, 'KÊNH BÁN HÀNG', NULL, '', NULL, 2, 1, '{"vi":"KÊNH BÁN HÀNG","en":"STOREFRONT","isCategory":true}'),
('01KV9ZM4DFDZNREBWEZ4ZM8PZM', '01KV9ZM4DETR0YJDYRPR5CJD37', 'Thư viện media', 'Image', '/media', 'media:view', 1, 1, '{"vi":"Thư viện media","en":"Media Library","isCategory":false}'),
('01KV9ZM4DE26CK55YDQ8VPWGC1', NULL, 'KHO ỨNG DỤNG', NULL, '', NULL, 5, 1, '{"vi":"KHO ỨNG DỤNG","en":"APP STORE","isCategory":true}'),
('01KV9ZM4DFPHN246AMSE824WQB', '01KV9ZM4DE26CK55YDQ8VPWGC1', 'Đã cài đặt', 'Package', '/apps', 'apps:view', 1, 1, '{"vi":"Đã cài đặt","en":"Installed Apps","isCategory":false}'),
('01KV9ZM4DFAFE6GA7TPV7R2E8J', '01KV9ZM4DE26CK55YDQ8VPWGC1', 'Kho ứng dụng', 'Grid', '/apps/store', 'apps:view', 2, 1, '{"vi":"Kho ứng dụng","en":"Apps Store","isCategory":false}'),
('01KV9ZM4DEVBN3MZMGTM84P3H7', NULL, 'HỆ THỐNG', NULL, '', NULL, 10, 1, '{"vi":"HỆ THỐNG","en":"SYSTEM","isCategory":true}'),
('01KV9ZM4DEXTFD8TRQVFZ55K54', '01KV9ZM4DEVBN3MZMGTM84P3H7', 'Bảo mật & Phân quyền', 'ShieldCheck', '', NULL, 1, 1, '{"vi":"Bảo mật & Phân quyền","en":"Access Control","isCategory":false}'),
('01KV9ZM4DFR1Z3572HSW1Q178S', '01KV9ZM4DEXTFD8TRQVFZ55K54', 'Người dùng', 'Users', '/users', 'users:view', 1, 1, '{"vi":"Người dùng","en":"Users","isCategory":false}'),
('01KV9ZM4DFKJ3Z2WG6JATZ13YB', '01KV9ZM4DEXTFD8TRQVFZ55K54', 'Vai trò', 'Shield', '/system/roles', 'roles:view', 2, 1, '{"vi":"Vai trò","en":"Roles","isCategory":false}'),
('01KV9ZM4DF284Y686E29YZ70QG', '01KV9ZM4DEXTFD8TRQVFZ55K54', 'Phân quyền', 'Lock', '/system/permissions', 'permissions:view', 3, 1, '{"vi":"Phân quyền","en":"Permissions","isCategory":false}'),
('01KV9ZM4DFXS6KX88Q20VPWRRJ', '01KV9ZM4DEXTFD8TRQVFZ55K54', 'API Keys', 'Key', '/api-keys', 'api_keys:view', 4, 1, '{"vi":"API Keys","en":"API Keys","isCategory":false}'),
('01KV9ZM4DE378KCXEDBFEJKPK5', '01KV9ZM4DEVBN3MZMGTM84P3H7', 'Nâng cao', 'TerminalSquare', '', NULL, 2, 1, '{"vi":"Nâng cao","en":"Advanced","isCategory":false}'),
('01KV9ZM4DFB8SKASF2DYVAHXH7', '01KV9ZM4DE378KCXEDBFEJKPK5', 'Menu', 'Menu', '/system/menus', 'menus:view', 1, 1, '{"vi":"Menu","en":"Menus","isCategory":false}'),
('01KV9ZM4DFMJHK6CQSVVG2GFEQ', '01KV9ZM4DE378KCXEDBFEJKPK5', 'Nhật ký', 'FileText', '/audit', 'audit:view', 2, 1, '{"vi":"Nhật ký","en":"Audit Logs","isCategory":false}'),
('01KV9ZM4DFGVKB7KP5W3M1X0DF', '01KV9ZM4DE378KCXEDBFEJKPK5', 'Cron Jobs', 'Clock', '/system/cron-jobs', 'settings:view', 3, 1, '{"vi":"Cron Jobs","en":"Cron Jobs","isCategory":false}'),
('01KV9ZM4DEY0BF07JHPWG45TPE', '01KV9ZM4DEVBN3MZMGTM84P3H7', 'Cài đặt', 'Settings', '', 'settings:view', 3, 1, '{"vi":"Cài đặt","en":"Settings","isCategory":false}'),
('01KV9ZM4DFNQHMGSCW9G5GX6JY', '01KV9ZM4DEY0BF07JHPWG45TPE', 'Hệ thống', NULL, '/settings', 'settings:view', 1, 1, '{"vi":"Hệ thống","en":"System","isCategory":false}'),
('01KV9ZM4DFH9YVREVBHQC142XC', '01KV9ZM4DEY0BF07JHPWG45TPE', 'Tên miền', NULL, '/settings/domains', 'settings:view', 2, 1, '{"vi":"Tên miền","en":"Domains","isCategory":false}'),
('01KV9ZM4DFDGX2C6CVFFPM7N1F', '01KV9ZM4DEY0BF07JHPWG45TPE', 'Webhooks', NULL, '/settings/webhooks', 'settings:view', 3, 1, '{"vi":"Webhooks","en":"Webhooks","isCategory":false}'),
('01KV9ZM4DEXS56KW7VPH2EXB7S', NULL, 'WEBBIOS', NULL, '', NULL, 20, 1, '{"vi":"WEBBIOS","en":"WEBBIOS","isCategory":true}'),
('01KV9ZM4DFCPZZDXY50Y6B4T5Z', '01KV9ZM4DEXS56KW7VPH2EXB7S', 'Sao lưu & Khôi phục', 'DatabaseBackup', '/webbios/backup-restore', NULL, 1, 1, '{"vi":"Sao lưu & Khôi phục","en":"Backup & Restore","isCategory":false}'),
('01KV9ZM4DF8VJ4YQ52K2JSGSV2', '01KV9ZM4DEXS56KW7VPH2EXB7S', 'Hạn mức Cloudflare', 'PieChart', '/webbios/cloudflare-quotas', NULL, 2, 1, '{"vi":"Hạn mức Cloudflare","en":"Cloudflare Quotas","isCategory":false}'),
('01KV9ZM4DFTSQJP7AYF7RBZAN1', '01KV9ZM4DEXS56KW7VPH2EXB7S', 'Cập nhật', 'CloudUpload', '/webbios/updates', NULL, 3, 1, '{"vi":"Cập nhật","en":"Updates","isCategory":false}');

-- ADMIN USER
INSERT INTO wb_users (id, email, password_hash, first_name, last_name, role_id, status) VALUES
('01KV9ZM4DG2BXHQTVA8XC26KSS', 'admin@webbios.local', '79cc643099214bc7f013265f6f2a757e:4241edfa8e52f23dd86e79dc386ee0f902eb61a83641ba0a1c64a620fb2fd21f', 'Webbi', 'Admin', '01KV9ZM4DA7SW1G5HCK1EDXF47', 'active');

-- SETTINGS
INSERT INTO wb_settings ("key", "value", group_name) VALUES
('site.name', '"My WebbiOS Site"', 'site'),
('site.description', '"Powered by WebbiOS"', 'site'),
('site.locale', '"vi"', 'site'),
('site.country', '"VN"', 'site'),
('site.timezone', '"Asia/Ho_Chi_Minh"', 'site'),
('site.currency', '"VND"', 'site'),
('system.version', '"1.0.0"', 'system');

