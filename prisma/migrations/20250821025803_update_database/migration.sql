/*
  Warnings:

  - You are about to drop the `DefaultShift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DefaultShift" DROP CONSTRAINT "DefaultShift_projectId_fkey";

-- DropForeignKey
ALTER TABLE "DefaultShift" DROP CONSTRAINT "DefaultShift_userId_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "shiftType" "ShiftType" NOT NULL DEFAULT 'MORNING',
ALTER COLUMN "shiftStatus" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "labels" SET DEFAULT 'LOW';

-- DropTable
DROP TABLE "DefaultShift";

-- CreateTable
CREATE TABLE "_ProjectToShift" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToShift_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectToShift_B_index" ON "_ProjectToShift"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToShift" ADD CONSTRAINT "_ProjectToShift_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToShift" ADD CONSTRAINT "_ProjectToShift_B_fkey" FOREIGN KEY ("B") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
