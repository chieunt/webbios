ALTER TABLE `wb_media` ADD `parent_id` text;--> statement-breakpoint
CREATE INDEX `idx_wb_media_parent` ON `wb_media` (`parent_id`);