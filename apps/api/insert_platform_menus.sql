INSERT INTO wb_menus (id, label, icon, path, parent_id, position, is_visible, is_system, app_slug, translations) VALUES
('menu_platform', 'PLATFORM SUITE', NULL, '', NULL, 2, 1, 0, 'platform', '{"isCategory":true}'),
('menu_platform_shops', 'Shops', 'Store', '/platform/shops', 'menu_platform', 1, 1, 0, 'platform', '{}'),
('menu_platform_versions', 'Core Versions', 'PackageOpen', '/platform/versions', 'menu_platform', 2, 1, 0, 'platform', '{}'),
('menu_platform_licenses', 'Bản quyền', 'Key', '/platform/licenses', 'menu_platform', 3, 1, 0, 'platform', '{}');
