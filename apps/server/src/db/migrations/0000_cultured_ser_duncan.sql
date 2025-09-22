CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'medium',
	`completed` integer DEFAULT false,
	`due_date` text,
	`created_at` text DEFAULT '2025-09-22T19:04:01.283Z',
	`completed_at` text,
	`category` text DEFAULT 'general'
);
