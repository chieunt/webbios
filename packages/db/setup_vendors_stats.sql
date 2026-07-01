-- Triggers for crm_vendors (App: crm, Entity: vendor)

-- 1. AFTER INSERT: Increment 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_vendor_insert 
AFTER INSERT ON crm_vendors
BEGIN
  -- Increment specific status
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'vendor', 'status_' || NEW.status, 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'status_' || NEW.status;
  
  -- Increment total
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'vendor', 'total', 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'total';
END;

-- 2. AFTER UPDATE OF status: Decrement old status, increment new status
CREATE TRIGGER IF NOT EXISTS trg_vendor_update_status
AFTER UPDATE OF status ON crm_vendors
WHEN OLD.status != NEW.status
BEGIN
  -- Decrement old status
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'status_' || OLD.status;
  
  -- Increment new status
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'vendor', 'status_' || NEW.status, 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'status_' || NEW.status;
END;

-- 3. AFTER DELETE: Decrement 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_vendor_delete
AFTER DELETE ON crm_vendors
BEGIN
  -- Decrement specific status
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'status_' || OLD.status;
  
  -- Decrement total
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'total';
END;

-- 4. Initial Seed for existing vendors
INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'vendor', 'total', 0);
UPDATE wb_stats SET value = (SELECT COUNT(*) FROM crm_vendors), updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'vendor' AND metric = 'total';

INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) SELECT 'crm', 'vendor', 'status_' || status, 0 FROM crm_vendors GROUP BY status;
-- To backfill dynamic grouped counts securely, we'll replace existing grouped metrics via generic update
REPLACE INTO wb_stats (app_slug, entity, metric, value, updated_at)
SELECT 'crm', 'vendor', 'status_' || status, COUNT(*), CURRENT_TIMESTAMP FROM crm_vendors GROUP BY status;
