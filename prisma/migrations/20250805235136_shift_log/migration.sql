/*
  Warnings:

  - You are about to drop the column `isDefault` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `managerNote` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `shiftDuration` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `shiftType` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ShiftLog` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ShiftLog` table. All the data in the column will be lost.
  - Added the required column `allDay` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftTitle` to the `ShiftLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShiftLog" DROP CONSTRAINT "ShiftLog_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftLog" DROP CONSTRAINT "ShiftLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropIndex
DROP INDEX "ShiftLog_userId_date_projectId_key";

-- AlterTable
ALTER TABLE "ShiftLog" DROP COLUMN "isDefault",
DROP COLUMN "managerNote",
DROP COLUMN "projectId",
DROP COLUMN "shiftDuration",
DROP COLUMN "shiftType",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "allDay" BOOLEAN NOT NULL,
ADD COLUMN     "job" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "note" TEXT NOT NULL,
ADD COLUMN     "shiftTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "projectId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ShiftActivity" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ShiftLogToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftLogToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ShiftLogToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftLogToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ShiftActivityToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftActivityToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ShiftActivityToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftActivityToTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ShiftActivityToShiftLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ShiftActivityToShiftLog_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShiftActivity_taskId_key" ON "ShiftActivity"("taskId");

-- CreateIndex
CREATE INDEX "_ShiftLogToUser_B_index" ON "_ShiftLogToUser"("B");

-- CreateIndex
CREATE INDEX "_ShiftLogToTask_B_index" ON "_ShiftLogToTask"("B");

-- CreateIndex
CREATE INDEX "_ShiftActivityToUser_B_index" ON "_ShiftActivityToUser"("B");

-- CreateIndex
CREATE INDEX "_ShiftActivityToTask_B_index" ON "_ShiftActivityToTask"("B");

-- CreateIndex
CREATE INDEX "_ShiftActivityToShiftLog_B_index" ON "_ShiftActivityToShiftLog"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftLogToUser" ADD CONSTRAINT "_ShiftLogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftLogToUser" ADD CONSTRAINT "_ShiftLogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftLogToTask" ADD CONSTRAINT "_ShiftLogToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftLogToTask" ADD CONSTRAINT "_ShiftLogToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToUser" ADD CONSTRAINT "_ShiftActivityToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToUser" ADD CONSTRAINT "_ShiftActivityToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToTask" ADD CONSTRAINT "_ShiftActivityToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToTask" ADD CONSTRAINT "_ShiftActivityToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToShiftLog" ADD CONSTRAINT "_ShiftActivityToShiftLog_A_fkey" FOREIGN KEY ("A") REFERENCES "ShiftActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ShiftActivityToShiftLog" ADD CONSTRAINT "_ShiftActivityToShiftLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ShiftLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
