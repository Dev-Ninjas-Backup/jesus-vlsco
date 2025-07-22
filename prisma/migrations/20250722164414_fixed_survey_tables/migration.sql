/*
  Warnings:

  - The values [SINGLE_SELECT,MULTI_SELECT] on the enum `SurveyQuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `optionId` on the `SurveyAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `isResponded` on the `SurveyUser` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `surveyType` on the `Survey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('EmployeeSatisfaction', 'EmployeeEngagement', 'HealthAndSafety', 'BenefitsSatisfaction', 'WorkLifeBalance', 'WorkEnvironment', 'TeamCollaboration', 'NewPolicyAwareness');

-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "SurveyQuestionType_new" AS ENUM ('SELECT', 'OPEN_ENDED', 'RANGE');
ALTER TABLE "SurveyQuestions" ALTER COLUMN "type" TYPE "SurveyQuestionType_new" USING ("type"::text::"SurveyQuestionType_new");
ALTER TYPE "SurveyQuestionType" RENAME TO "SurveyQuestionType_old";
ALTER TYPE "SurveyQuestionType_new" RENAME TO "SurveyQuestionType";
DROP TYPE "SurveyQuestionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "SurveyAnswer" DROP CONSTRAINT "SurveyAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyUser" DROP CONSTRAINT "SurveyUser_surveyId_fkey";

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "status" "SurveyStatus" NOT NULL DEFAULT 'DRAFT',
DROP COLUMN "surveyType",
ADD COLUMN     "surveyType" "SurveyType" NOT NULL;

-- AlterTable
ALTER TABLE "SurveyAnswer" DROP COLUMN "optionId";

-- AlterTable
ALTER TABLE "SurveyQuestions" ALTER COLUMN "multiSelect" SET DEFAULT false;

-- AlterTable
ALTER TABLE "SurveyUser" DROP COLUMN "isResponded";

-- CreateTable
CREATE TABLE "SurveyAnswerOption" (
    "id" TEXT NOT NULL,
    "answerId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyAnswerOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "SurveyAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyUser" ADD CONSTRAINT "SurveyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyUser" ADD CONSTRAINT "SurveyUser_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
