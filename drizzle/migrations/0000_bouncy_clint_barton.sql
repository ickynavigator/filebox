-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
CREATE TABLE `Tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`updatedAt` numeric NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `_IFileToTag` (
	`A` text NOT NULL,
	`B` text NOT NULL,
	FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`A`) REFERENCES `IFile`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_IFileToTag_B_index` ON `_IFileToTag` (`B`);--> statement-breakpoint
CREATE UNIQUE INDEX `_IFileToTag_AB_unique` ON `_IFileToTag` (`A`,`B`);--> statement-breakpoint
CREATE TABLE `IFile` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`size` integer,
	`updatedAt` numeric NOT NULL,
	`createdAt` numeric DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`expiresAt` numeric
);