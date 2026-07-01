CREATE TABLE `wb_languages` (
	`code` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`native_name` text NOT NULL,
	`flag` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
INSERT INTO `wb_languages` (`code`, `name`, `native_name`, `flag`, `is_active`) VALUES
('vi', 'Tiếng Việt', 'Tiếng Việt', 'vn', 1),
('en', 'English', 'English', 'us', 1),
('fr', 'French', 'Français', 'fr', 1),
('de', 'German', 'Deutsch', 'de', 1),
('ja', 'Japanese', '日本語', 'jp', 1),
('ko', 'Korean', '한국어', 'kr', 1),
('zh', 'Chinese', '中文', 'cn', 1);
