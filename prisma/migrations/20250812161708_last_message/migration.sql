-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "lastMessageId" TEXT;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "TeamMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
