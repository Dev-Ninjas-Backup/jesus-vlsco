/*
  Warnings:

  - You are about to drop the `ShiftActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShiftToTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftActivity" DROP CONSTRAINT "ShiftActivity_shiftId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftActivity" DROP CONSTRAINT "ShiftActivity_taskId_fkey";

-- DropForeignKey
ALTER TABLE "ShiftActivity" DROP CONSTRAINT "ShiftActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftToTask" DROP CONSTRAINT "_ShiftToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShiftToTask" DROP CONSTRAINT "_ShiftToTask_B_fkey";

-- DropTable
DROP TABLE "ShiftActivity";

-- DropTable
DROP TABLE "_ShiftToTask";
