-- AlterTable
ALTER TABLE "PrivateConversation" ADD COLUMN     "lastMessageId" TEXT;

-- AddForeignKey
ALTER TABLE "PrivateConversation" ADD CONSTRAINT "PrivateConversation_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "PrivateMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
