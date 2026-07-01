UPDATE wb_menus SET position = 8 WHERE id = 'menu_app_crm_reports';
INSERT INTO wb_menus (id, parent_id, label, icon, path, app_slug, position, is_system, is_category, translations) 
VALUES ('menu_app_crm_vendors', 'menu_app_crm_root', 'Vendors', 'Store', '/apps/crm/vendors', 'crm', 7, 0, 0, '{"en":"Vendors","en-US":"Vendors","en-GB":"Vendors","vi":"Thương hiệu","es":"Marcas","fr":"Marques","de":"Marken","id":"Merek","th":"แบรนด์","zh-CN":"品牌","zh-TW":"品牌","ja":"ブランド","ko":"브랜드"}')
ON CONFLICT(id) DO UPDATE SET translations = excluded.translations, position = excluded.position;
