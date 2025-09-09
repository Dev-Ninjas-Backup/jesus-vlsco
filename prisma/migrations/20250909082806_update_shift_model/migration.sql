-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
