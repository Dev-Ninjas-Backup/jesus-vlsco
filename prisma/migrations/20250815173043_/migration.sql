-- AlterTable
ALTER TABLE "RecognitionLikeComment" ADD COLUMN     "commenterId" TEXT;

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
