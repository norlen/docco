CREATE TABLE `navigation` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`url` text NOT NULL,
	`fullPath` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_fullPath_unique` ON `pages` (`fullPath`);--> statement-breakpoint
CREATE INDEX `pages_slug_idx` ON `pages` (`slug`);