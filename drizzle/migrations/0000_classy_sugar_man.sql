CREATE TABLE `IFile` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`size` integer,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`expiresAt` integer
);
--> statement-breakpoint
CREATE TABLE `_IFileToTag` (
	`A` text NOT NULL,
	`B` text NOT NULL,
	FOREIGN KEY (`A`) REFERENCES `IFile`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `_IFileToTag_B_index` ON `_IFileToTag` (`B`);--> statement-breakpoint
CREATE UNIQUE INDEX `_IFileToTag_AB_unique` ON `_IFileToTag` (`A`,`B`);--> statement-breakpoint
CREATE TABLE `Tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL
);
