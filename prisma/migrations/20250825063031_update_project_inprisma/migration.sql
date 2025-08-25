/*
  Warnings:

  - You are about to drop the `_ProjectToShift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToShift" DROP CONSTRAINT "_ProjectToShift_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToShift" DROP CONSTRAINT "_ProjectToShift_B_fkey";

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "projectId" TEXT;

-- DropTable
DROP TABLE "_ProjectToShift";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
