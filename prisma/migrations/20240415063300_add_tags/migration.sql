/*
  Warnings:

  - Added the required column `updatedAt` to the `IFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_IFileToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_IFileToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "IFile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IFileToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_IFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_IFile" ("description", "id", "name", "size", "url") SELECT "description", "id", "name", "size", "url" FROM "IFile";
DROP TABLE "IFile";
ALTER TABLE "new_IFile" RENAME TO "IFile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_IFileToTag_AB_unique" ON "_IFileToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_IFileToTag_B_index" ON "_IFileToTag"("B");
