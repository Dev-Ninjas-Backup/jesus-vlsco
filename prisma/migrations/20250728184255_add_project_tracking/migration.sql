/*
  Warnings:

  - A unique constraint covering the columns `[userId,date,projectId]` on the table `ShiftLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `DefaultShift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DefaultShift_userId_key";

-- DropIndex
DROP INDEX "ShiftLog_userId_date_key";

-- AlterTable
ALTER TABLE "DefaultShift" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShiftLog" ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLog_userId_date_projectId_key" ON "ShiftLog"("userId", "date", "projectId");

-- AddForeignKey
ALTER TABLE "DefaultShift" ADD CONSTRAINT "DefaultShift_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftLog" ADD CONSTRAINT "ShiftLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
