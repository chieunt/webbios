CREATE TABLE `wb_api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`secret_hash` text NOT NULL,
	`secret_prefix` text NOT NULL,
	`scopes` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_by` text NOT NULL,
	`expires_at` text,
	`last_used_at` text,
	`request_count` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `wb_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wb_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`resource_title` text,
	`changes` text,
	`route` text,
	`method` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `wb_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wb_installed_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`type` text DEFAULT 'suite' NOT NULL,
	`author` text,
	`description` text,
	`icon_url` text,
	`worker_name` text,
	`worker_url` text,
	`config` text,
	`permissions_registered` text,
	`hooks` text,
	`menu_config` text,
	`tables_created` text,
	`status` text DEFAULT 'active' NOT NULL,
	`installed_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wb_media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`r2_key` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text,
	`size` integer,
	`width` integer,
	`height` integer,
	`alt` text,
	`uploaded_by` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `wb_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `wb_menus` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`icon` text,
	`path` text NOT NULL,
	`parent_id` text,
	`permission_slug` text,
	`app_slug` text,
	`position` integer DEFAULT 0 NOT NULL,
	`is_visible` integer DEFAULT true NOT NULL,
	`is_system` integer DEFAULT false NOT NULL,
	`translations` text DEFAULT '{}',
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wb_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`group_name` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wb_role_permissions` (
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	PRIMARY KEY(`permission_id`, `role_id`),
	FOREIGN KEY (`role_id`) REFERENCES `wb_roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `wb_permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wb_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`is_system` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wb_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`refresh_token` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `wb_users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `wb_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`group_name` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wb_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`phone` text,
	`username` text,
	`password_hash` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`avatar_url` text,
	`dob` text,
	`gender` text,
	`role_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`last_login_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `wb_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wb_api_keys_secret_hash_unique` ON `wb_api_keys` (`secret_hash`);--> statement-breakpoint
CREATE INDEX `idx_wb_api_keys_secret` ON `wb_api_keys` (`secret_hash`);--> statement-breakpoint
CREATE INDEX `idx_wb_api_keys_status` ON `wb_api_keys` (`status`);--> statement-breakpoint
CREATE INDEX `idx_wb_audit_user` ON `wb_audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_audit_action` ON `wb_audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_wb_audit_resource` ON `wb_audit_logs` (`resource_type`,`resource_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_audit_created` ON `wb_audit_logs` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_installed_apps_slug_unique` ON `wb_installed_apps` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_media_r2_key_unique` ON `wb_media` (`r2_key`);--> statement-breakpoint
CREATE INDEX `idx_wb_media_type` ON `wb_media` (`mime_type`);--> statement-breakpoint
CREATE INDEX `idx_wb_media_created` ON `wb_media` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_wb_menus_parent` ON `wb_menus` (`parent_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_menus_app` ON `wb_menus` (`app_slug`);--> statement-breakpoint
CREATE INDEX `idx_wb_menus_position` ON `wb_menus` (`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_permissions_slug_unique` ON `wb_permissions` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_wb_permissions_slug` ON `wb_permissions` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_wb_permissions_group` ON `wb_permissions` (`group_name`);--> statement-breakpoint
CREATE INDEX `idx_wb_rp_role` ON `wb_role_permissions` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_rp_perm` ON `wb_role_permissions` (`permission_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_roles_slug_unique` ON `wb_roles` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_wb_roles_slug` ON `wb_roles` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_sessions_refresh_token_unique` ON `wb_sessions` (`refresh_token`);--> statement-breakpoint
CREATE INDEX `idx_wb_sessions_user` ON `wb_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_sessions_token` ON `wb_sessions` (`refresh_token`);--> statement-breakpoint
CREATE INDEX `idx_wb_sessions_expires` ON `wb_sessions` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_wb_settings_group` ON `wb_settings` (`group_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_users_email_unique` ON `wb_users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `wb_users_username_unique` ON `wb_users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_wb_users_email` ON `wb_users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_wb_users_phone` ON `wb_users` (`phone`);--> statement-breakpoint
CREATE INDEX `idx_wb_users_username` ON `wb_users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_wb_users_role` ON `wb_users` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_wb_users_status` ON `wb_users` (`status`);