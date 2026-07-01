-- Create crm_stats table
CREATE TABLE IF NOT EXISTS crm_stats (
  entity TEXT NOT NULL,
  metric TEXT NOT NULL,
  value INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (entity, metric)
);

-- Triggers for crm_suppliers

-- 1. AFTER INSERT: Increment 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_supplier_insert 
AFTER INSERT ON crm_suppliers
BEGIN
  -- Increment specific status
  INSERT INTO crm_stats (entity, metric, value) 
  VALUES ('supplier', 'status_' || NEW.status, 1)
  ON CONFLICT(entity, metric) DO UPDATE SET value = value + 1, updated_at = CURRENT_TIMESTAMP;
  
  -- Increment total
  INSERT INTO crm_stats (entity, metric, value) 
  VALUES ('supplier', 'total', 1)
  ON CONFLICT(entity, metric) DO UPDATE SET value = value + 1, updated_at = CURRENT_TIMESTAMP;
END;

-- 2. AFTER UPDATE OF status: Decrement old status, increment new status
CREATE TRIGGER IF NOT EXISTS trg_supplier_update_status
AFTER UPDATE OF status ON crm_suppliers
WHEN OLD.status != NEW.status
BEGIN
  -- Decrement old status
  UPDATE crm_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE entity = 'supplier' AND metric = 'status_' || OLD.status;
  
  -- Increment new status
  INSERT INTO crm_stats (entity, metric, value) 
  VALUES ('supplier', 'status_' || NEW.status, 1)
  ON CONFLICT(entity, metric) DO UPDATE SET value = value + 1, updated_at = CURRENT_TIMESTAMP;
END;

-- 3. AFTER DELETE: Decrement 'total' and 'status_' + status
CREATE TRIGGER IF NOT EXISTS trg_supplier_delete
AFTER DELETE ON crm_suppliers
BEGIN
  -- Decrement specific status
  UPDATE crm_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE entity = 'supplier' AND metric = 'status_' || OLD.status;
  
  -- Decrement total
  UPDATE crm_stats SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE entity = 'supplier' AND metric = 'total';
END;

-- 4. Initial Seed for existing suppliers
-- We will run this logic to backfill the crm_stats table
INSERT INTO crm_stats (entity, metric, value)
SELECT 'supplier', 'total', COUNT(*) FROM crm_suppliers
ON CONFLICT(entity, metric) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;

INSERT INTO crm_stats (entity, metric, value)
SELECT 'supplier', 'status_' || status, COUNT(*) FROM crm_suppliers GROUP BY status
ON CONFLICT(entity, metric) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;
