-- Create wb_stats table
CREATE TABLE IF NOT EXISTS wb_stats (
  app_slug TEXT NOT NULL,
  entity TEXT NOT NULL,
  metric TEXT NOT NULL,
  value INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (app_slug, entity, metric)
);

-- Triggers for crm_suppliers (App: crm, Entity: supplier)

-- 1. AFTER INSERT: Increment 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_supplier_insert 
AFTER INSERT ON crm_suppliers
BEGIN
  -- Increment specific status
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'supplier', 'status_' || NEW.status, 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'status_' || NEW.status;
  
  -- Increment total
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'supplier', 'total', 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'total';
END;

-- 2. AFTER UPDATE OF status: Decrement old status, increment new status
CREATE TRIGGER IF NOT EXISTS trg_supplier_update_status
AFTER UPDATE OF status ON crm_suppliers
WHEN OLD.status != NEW.status
BEGIN
  -- Decrement old status
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'status_' || OLD.status;
  
  -- Increment new status
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'supplier', 'status_' || NEW.status, 0);
  UPDATE wb_stats SET value = value + 1, updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'status_' || NEW.status;
END;

-- 3. AFTER DELETE: Decrement 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_supplier_delete
AFTER DELETE ON crm_suppliers
BEGIN
  -- Decrement specific status
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'status_' || OLD.status;
  
  -- Decrement total
  UPDATE wb_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'total';
END;

-- 4. Initial Seed for existing suppliers
INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('crm', 'supplier', 'total', 0);
UPDATE wb_stats SET value = (SELECT COUNT(*) FROM crm_suppliers), updated_at = CURRENT_TIMESTAMP WHERE app_slug = 'crm' AND entity = 'supplier' AND metric = 'total';

INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) SELECT 'crm', 'supplier', 'status_' || status, 0 FROM crm_suppliers GROUP BY status;
-- To backfill dynamic grouped counts securely, we'll replace existing grouped metrics via generic update
REPLACE INTO wb_stats (app_slug, entity, metric, value, updated_at)
SELECT 'crm', 'supplier', 'status_' || status, COUNT(*), CURRENT_TIMESTAMP FROM crm_suppliers GROUP BY status;
