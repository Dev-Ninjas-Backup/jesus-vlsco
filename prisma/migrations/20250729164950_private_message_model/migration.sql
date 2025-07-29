-- DropForeignKey
ALTER TABLE "PrivateMessage" DROP CONSTRAINT "PrivateMessage_fileId_fkey";

-- AlterTable
ALTER TABLE "PrivateMessage" ALTER COLUMN "fileId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PrivateMessage" ADD CONSTRAINT "PrivateMessage_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
