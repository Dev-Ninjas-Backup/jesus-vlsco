/*
  Warnings:

  - Added the required column `fileId` to the `PrivateMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('image', 'docs', 'link');

-- AlterTable
ALTER TABLE "PrivateMessage" ADD COLUMN     "fileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeamMessage" ADD COLUMN     "fileId" TEXT;

-- CreateTable
CREATE TABLE "FileInstance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "caption" TEXT,
    "path" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "FileInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMessage" ADD CONSTRAINT "TeamMessage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
