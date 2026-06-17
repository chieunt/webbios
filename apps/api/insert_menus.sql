INSERT INTO wb_menus (id, label, icon, path, parent_id, position, is_visible, is_system, app_slug) VALUES
('menu_platform', 'Platform Suite', 'server', '', NULL, 100, 1, 0, 'platform'),
('menu_platform_shops', 'Shops', 'store', '/platform/shops', 'menu_platform', 1, 1, 0, 'platform'),
('menu_platform_licenses', 'Bản quyền', 'key', '/platform/licenses', 'menu_platform', 2, 1, 0, 'platform');
