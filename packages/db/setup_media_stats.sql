-- Create wb_stats table if not exists
CREATE TABLE IF NOT EXISTS wb_stats (
  app_slug TEXT NOT NULL,
  entity TEXT NOT NULL,
  metric TEXT NOT NULL,
  value INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (app_slug, entity, metric)
);

-- 1. AFTER INSERT
CREATE TRIGGER IF NOT EXISTS trg_media_insert
AFTER INSERT ON wb_media
BEGIN
  -- If root level, update wb_stats
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) 
  VALUES ('media', 'root', CASE WHEN NEW.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END, 0);

  UPDATE wb_stats 
  SET value = value + 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'media' AND entity = 'root' 
    AND metric = CASE WHEN NEW.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END 
    AND NEW.parent_id IS NULL;

  -- If inside a folder, update parent folder's counters
  UPDATE wb_media 
  SET file_count = file_count + CASE WHEN NEW.mime_type != 'folder' THEN 1 ELSE 0 END,
      folder_count = folder_count + CASE WHEN NEW.mime_type = 'folder' THEN 1 ELSE 0 END
  WHERE id = NEW.parent_id AND NEW.parent_id IS NOT NULL;
END;

-- 2. AFTER DELETE
CREATE TRIGGER IF NOT EXISTS trg_media_delete
AFTER DELETE ON wb_media
BEGIN
  -- If root level, update wb_stats
  UPDATE wb_stats 
  SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'media' AND entity = 'root' 
    AND metric = CASE WHEN OLD.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END 
    AND OLD.parent_id IS NULL;

  -- If inside a folder, update parent folder's counters
  UPDATE wb_media 
  SET file_count = file_count - CASE WHEN OLD.mime_type != 'folder' THEN 1 ELSE 0 END,
      folder_count = folder_count - CASE WHEN OLD.mime_type = 'folder' THEN 1 ELSE 0 END
  WHERE id = OLD.parent_id AND OLD.parent_id IS NOT NULL;
END;

-- 3. AFTER UPDATE OF parent_id (Moving files)
CREATE TRIGGER IF NOT EXISTS trg_media_update_parent
AFTER UPDATE OF parent_id ON wb_media
WHEN IFNULL(OLD.parent_id, '') != IFNULL(NEW.parent_id, '')
BEGIN
  -- 1. Decrement from OLD parent
  UPDATE wb_stats 
  SET value = value - 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'media' AND entity = 'root' 
    AND metric = CASE WHEN OLD.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END 
    AND OLD.parent_id IS NULL;

  UPDATE wb_media 
  SET file_count = file_count - CASE WHEN OLD.mime_type != 'folder' THEN 1 ELSE 0 END,
      folder_count = folder_count - CASE WHEN OLD.mime_type = 'folder' THEN 1 ELSE 0 END
  WHERE id = OLD.parent_id AND OLD.parent_id IS NOT NULL;

  -- 2. Increment to NEW parent
  INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) 
  VALUES ('media', 'root', CASE WHEN NEW.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END, 0);

  UPDATE wb_stats 
  SET value = value + 1, updated_at = CURRENT_TIMESTAMP 
  WHERE app_slug = 'media' AND entity = 'root' 
    AND metric = CASE WHEN NEW.mime_type = 'folder' THEN 'total_folders' ELSE 'total_files' END 
    AND NEW.parent_id IS NULL;

  UPDATE wb_media 
  SET file_count = file_count + CASE WHEN NEW.mime_type != 'folder' THEN 1 ELSE 0 END,
      folder_count = folder_count + CASE WHEN NEW.mime_type = 'folder' THEN 1 ELSE 0 END
  WHERE id = NEW.parent_id AND NEW.parent_id IS NOT NULL;
END;

-- BACKFILL INITIAL DATA
-- Initialize root stats
INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('media', 'root', 'total_files', 0);
INSERT OR IGNORE INTO wb_stats (app_slug, entity, metric, value) VALUES ('media', 'root', 'total_folders', 0);

UPDATE wb_stats 
SET value = (SELECT COUNT(*) FROM wb_media WHERE parent_id IS NULL AND mime_type != 'folder'), updated_at = CURRENT_TIMESTAMP 
WHERE app_slug = 'media' AND entity = 'root' AND metric = 'total_files';

UPDATE wb_stats 
SET value = (SELECT COUNT(*) FROM wb_media WHERE parent_id IS NULL AND mime_type = 'folder'), updated_at = CURRENT_TIMESTAMP 
WHERE app_slug = 'media' AND entity = 'root' AND metric = 'total_folders';

-- Initialize folder stats
-- Update file counts
UPDATE wb_media 
SET file_count = (
  SELECT COUNT(*) FROM wb_media child WHERE child.parent_id = wb_media.id AND child.mime_type != 'folder'
)
WHERE mime_type = 'folder';

-- Update folder counts
UPDATE wb_media 
SET folder_count = (
  SELECT COUNT(*) FROM wb_media child WHERE child.parent_id = wb_media.id AND child.mime_type = 'folder'
)
WHERE mime_type = 'folder';
