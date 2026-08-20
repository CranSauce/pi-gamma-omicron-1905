PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`full_name` text NOT NULL,
	`user_id` text DEFAULT '' NOT NULL,
	`role` text DEFAULT 'brother' NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`chapter` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);--> statement-breakpoint
INSERT INTO `__new_members` (
	`id`, `email`, `full_name`, `user_id`, `role`, `title`, `chapter`, `location`, `bio`, `active`, `created_at`, `updated_at`
)
SELECT
	`id`,
	LOWER(`email`),
	`full_name`,
	'',
	CASE WHEN `role` = 'member' THEN 'brother' ELSE `role` END,
	'',
	`chapter`,
	'',
	'',
	`active`,
	`created_at`,
	CURRENT_TIMESTAMP
FROM `members`;--> statement-breakpoint
DROP TABLE `members`;--> statement-breakpoint
ALTER TABLE `__new_members` RENAME TO `members`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE INDEX `idx_members_active_chapter` ON `members` (`active`,`chapter`);--> statement-breakpoint
CREATE INDEX `idx_members_role_active` ON `members` (`role`,`active`);--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint

CREATE TABLE `announcements` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`audience` text DEFAULT 'all' NOT NULL,
	`author_member_id` integer NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
CREATE INDEX `idx_announcements_published_created_at` ON `announcements` (`published`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_announcements_audience_created_at` ON `announcements` (`audience`,`created_at`);--> statement-breakpoint

CREATE TABLE `discussion_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`category` text DEFAULT 'brotherhood' NOT NULL,
	`author_member_id` integer NOT NULL,
	`pinned` integer DEFAULT false NOT NULL,
	`locked` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`author_member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
CREATE INDEX `idx_discussion_threads_pinned_created_at` ON `discussion_threads` (`pinned`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_discussion_threads_author_member_id` ON `discussion_threads` (`author_member_id`);--> statement-breakpoint

CREATE TABLE `discussion_replies` (
	`id` text PRIMARY KEY NOT NULL,
	`thread_id` text NOT NULL,
	`author_member_id` integer NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`thread_id`) REFERENCES `discussion_threads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`author_member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
CREATE INDEX `idx_discussion_replies_thread_created_at` ON `discussion_replies` (`thread_id`,`created_at`);--> statement-breakpoint
PRAGMA optimize;
