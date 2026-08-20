CREATE TABLE `interests` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`preferred_name` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`institution` text NOT NULL,
	`institution_type` text NOT NULL,
	`field_of_study` text DEFAULT '' NOT NULL,
	`graduation_year` text DEFAULT '' NOT NULL,
	`current_status` text NOT NULL,
	`chapter_interest` text NOT NULL,
	`why_interested` text NOT NULL,
	`brotherhood_meaning` text NOT NULL,
	`referral_source` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_interests_status_created_at` ON `interests` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_interests_email` ON `interests` (`email`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`chapter` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_email_unique` ON `members` (`email`);