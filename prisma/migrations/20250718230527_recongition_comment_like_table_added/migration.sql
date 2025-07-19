/*
  Warnings:

  - Added the required column `updatedAt` to the `Recognition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('LIKE', 'LOVE_FACE', 'SMILE_FACE', 'WOW_FACE', 'SAD_FACE', 'CELEBRATION');

-- AlterTable
ALTER TABLE "Recognition" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "RecognitionLikeComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "reaction" "Reaction",
    "recognitionId" TEXT NOT NULL,
    "recognitionUserId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecognitionLikeComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "Recognition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_recognitionId_recognitionUserId_fkey" FOREIGN KEY ("recognitionId", "recognitionUserId") REFERENCES "RecognitionUser"("recognitionId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "RecognitionLikeComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
