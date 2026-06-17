DELETE FROM wb_menus;
INSERT INTO wb_menus (id, parent_id, label, icon, path, permission_slug, position, is_system, translations) VALUES
('01KTC8SHPEESPJEDSK19MG72VC', NULL, 'Tổng quan', 'Home', '/', 'dashboard:view', 1, 1, '{"vi":"Tổng quan","en":"Overview","isCategory":false}'),

-- STOREFRONT CATEGORY
('menu_cat_storefront', NULL, 'KÊNH BÁN HÀNG', NULL, '', NULL, 2, 1, '{"vi":"KÊNH BÁN HÀNG","en":"STOREFRONT","isCategory":true}'),
('01KTC8SHPEV0W5WEHBHW506XY4', 'menu_cat_storefront', 'Thư viện media', 'Image', '/media', 'media:view', 1, 1, '{"vi":"Thư viện media","en":"Media Library","isCategory":false}'),

-- APP STORE CATEGORY
('01KTC8SHPEXXXXXXXXXXXXXXX1', NULL, 'KHO ỨNG DỤNG', NULL, '', NULL, 5, 1, '{"vi":"KHO ỨNG DỤNG","en":"APP STORE","isCategory":true}'),
('01KTC8SHPEXXXXXXXXXXXXXXX2', '01KTC8SHPEXXXXXXXXXXXXXXX1', 'Ứng dụng đã cài', 'Package', '/apps', 'apps:view', 1, 1, '{"vi":"Ứng dụng đã cài","en":"Installed Apps","isCategory":false}'),
('01KTC8SHPEXXXXXXXXXXXXXXX3', '01KTC8SHPEXXXXXXXXXXXXXXX1', 'Kho ứng dụng', 'Store', '/apps/store', 'apps:view', 2, 1, '{"vi":"Kho ứng dụng","en":"App Store","isCategory":false}'),

-- SYSTEM CATEGORY
('01KTC8SHPE2JKWW09BPE5ZS2XB', NULL, 'HỆ THỐNG', NULL, '', NULL, 10, 1, '{"vi":"HỆ THỐNG","en":"SYSTEM","isCategory":true}'),

-- SYSTEM > ACCESS CONTROL
('menu_cat_security', '01KTC8SHPE2JKWW09BPE5ZS2XB', 'Bảo mật & Phân quyền', 'ShieldCheck', '', NULL, 1, 1, '{"vi":"Bảo mật & Phân quyền","en":"Access Control","isCategory":false}'),
('01KTC8SHPFVKGC64CS0K0487H0', 'menu_cat_security', 'Người dùng', 'Users', '/users', 'users:view', 1, 1, '{"vi":"Người dùng","en":"Users","isCategory":false}'),
('01KTC8SHPF5ACGYR0CRHRNVGVY', 'menu_cat_security', 'Vai trò', 'Shield', '/system/roles', 'roles:view', 2, 1, '{"vi":"Vai trò","en":"Roles","isCategory":false}'),
('01KTC8SHPG28BX293S61TPY8V5', 'menu_cat_security', 'Phân quyền', 'Lock', '/system/permissions', 'permissions:view', 3, 1, '{"vi":"Phân quyền","en":"Permissions","isCategory":false}'),
('01KTC8SHPG2BNWZFZRN7HEKA0D', 'menu_cat_security', 'API Keys', 'Key', '/api-keys', 'api_keys:view', 4, 1, '{"vi":"API Keys","en":"API Keys","isCategory":false}'),

-- SYSTEM > ADVANCED
('menu_cat_advanced', '01KTC8SHPE2JKWW09BPE5ZS2XB', 'Nâng cao', 'TerminalSquare', '', NULL, 2, 1, '{"vi":"Nâng cao","en":"Advanced","isCategory":false}'),
('01KTC8SHPFKJZJXYE03SFYXQMQ', 'menu_cat_advanced', 'Menu', 'Menu', '/system/menus', 'menus:view', 1, 1, '{"vi":"Menu","en":"Menus","isCategory":false}'),
('01KTC8SHPGRCS9ZVBJ0YP6AZ6Z', 'menu_cat_advanced', 'Nhật ký', 'FileText', '/audit', 'audit:view', 2, 1, '{"vi":"Nhật ký","en":"Audit Logs","isCategory":false}'),
('01KTC8SHP_CRON_JOBS', 'menu_cat_advanced', 'Cron Jobs', 'Clock', '/system/cron-jobs', 'settings:view', 3, 1, '{"vi":"Cron Jobs","en":"Cron Jobs","isCategory":false}'),

-- SYSTEM > SETTINGS
('01KTC8SHPG2K192J880B4J2B4W', '01KTC8SHPE2JKWW09BPE5ZS2XB', 'Cài đặt', 'Settings', '', 'settings:view', 3, 1, '{"vi":"Cài đặt","en":"Settings","isCategory":false}'),
('menu_set_system', '01KTC8SHPG2K192J880B4J2B4W', 'Hệ thống', NULL, '/settings', 'settings:view', 1, 1, '{"vi":"Hệ thống","en":"System","isCategory":false}'),
('menu_set_domains', '01KTC8SHPG2K192J880B4J2B4W', 'Tên miền', NULL, '/settings/domains', 'settings:view', 2, 1, '{"vi":"Tên miền","en":"Domains","isCategory":false}'),
('menu_set_webhooks', '01KTC8SHPG2K192J880B4J2B4W', 'Webhooks', NULL, '/settings/webhooks', 'settings:view', 3, 1, '{"vi":"Webhooks","en":"Webhooks","isCategory":false}'),

-- WEBBIOS CATEGORY
('01KTC8SHPEW5CV3VW84PM3ZHKJ', NULL, 'WEBBIOS', NULL, '', NULL, 20, 1, '{"vi":"WEBBIOS","en":"WEBBIOS","isCategory":true}'),
('menu_wb_backup_restore', '01KTC8SHPEW5CV3VW84PM3ZHKJ', 'Sao lưu & Khôi phục', 'DatabaseBackup', '/webbios/backup-restore', NULL, 1, 1, '{"vi":"Sao lưu & Khôi phục","en":"Backup & Restore","isCategory":false}'),
('menu_wb_cf_quotas', '01KTC8SHPEW5CV3VW84PM3ZHKJ', 'Hạn mức Cloudflare', 'PieChart', '/webbios/cloudflare-quotas', NULL, 2, 1, '{"vi":"Hạn mức Cloudflare","en":"Cloudflare Quotas","isCategory":false}'),
('01KTC8SHPGA1DPRJ2JM2R54AYP', '01KTC8SHPEW5CV3VW84PM3ZHKJ', 'Cập nhật', 'CloudUpload', '/webbios/updates', NULL, 3, 1, '{"vi":"Cập nhật","en":"Updates","isCategory":false}');
