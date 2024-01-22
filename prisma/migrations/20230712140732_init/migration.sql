-- CreateTable
CREATE TABLE "IFile" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,

    CONSTRAINT "IFile_pkey" PRIMARY KEY ("id")
);
