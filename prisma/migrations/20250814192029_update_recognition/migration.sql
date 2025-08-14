-- DropForeignKey
ALTER TABLE "RecognitionLikeComment" DROP CONSTRAINT "RecognitionLikeComment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "RecognitionLikeComment" DROP CONSTRAINT "RecognitionLikeComment_recognitionId_recognitionUserId_fkey";

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_recognitionId_recognitionUserId_fkey" FOREIGN KEY ("recognitionId", "recognitionUserId") REFERENCES "RecognitionUser"("recognitionId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "RecognitionLikeComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
