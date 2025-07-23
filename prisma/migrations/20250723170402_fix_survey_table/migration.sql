/*
  Warnings:

  - A unique constraint covering the columns `[userId,surveyId]` on the table `SurveyUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SurveyUser" ADD COLUMN     "isResponded" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyUser_userId_surveyId_key" ON "SurveyUser"("userId", "surveyId");
