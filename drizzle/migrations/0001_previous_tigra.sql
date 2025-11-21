DROP INDEX "_IFileToTag_B_index";--> statement-breakpoint
DROP INDEX "_IFileToTag_AB_unique";--> statement-breakpoint
ALTER TABLE `Tag` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL;--> statement-breakpoint
CREATE INDEX `_IFileToTag_B_index` ON `_IFileToTag` (`B`);--> statement-breakpoint
CREATE UNIQUE INDEX `_IFileToTag_AB_unique` ON `_IFileToTag` (`A`,`B`);--> statement-breakpoint
ALTER TABLE `Tag` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `IFile` ALTER COLUMN "updatedAt" TO "updatedAt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `IFile` ALTER COLUMN "createdAt" TO "createdAt" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `IFile` ALTER COLUMN "expiresAt" TO "expiresAt" integer;