-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- AlterTable
ALTER TABLE "SurveyQuestions" ALTER COLUMN "isRequired" SET DEFAULT false,
ALTER COLUMN "captureLocation" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SurveyQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
