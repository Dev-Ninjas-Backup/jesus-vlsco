-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementReactedUser" DROP CONSTRAINT "AnnouncementReactedUser_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "AnnouncementReactedUser" DROP CONSTRAINT "AnnouncementReactedUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Attachments" DROP CONSTRAINT "Attachments_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "CompaniesBranch" DROP CONSTRAINT "CompaniesBranch_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompaniesBranch" DROP CONSTRAINT "CompaniesBranch_managerId_fkey";

-- DropForeignKey
ALTER TABLE "Recognition" DROP CONSTRAINT "Recognition_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "RecognitionLikeComment" DROP CONSTRAINT "RecognitionLikeComment_recognitionId_fkey";

-- DropForeignKey
ALTER TABLE "RecognitionUser" DROP CONSTRAINT "RecognitionUser_recognitionId_fkey";

-- DropForeignKey
ALTER TABLE "RecognitionUser" DROP CONSTRAINT "RecognitionUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswer" DROP CONSTRAINT "SurveyAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswer" DROP CONSTRAINT "SurveyAnswer_responseId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswerOption" DROP CONSTRAINT "SurveyAnswerOption_answerId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyAnswerOption" DROP CONSTRAINT "SurveyAnswerOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyResponse" DROP CONSTRAINT "SurveyResponse_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "TimeOffRequest" DROP CONSTRAINT "TimeOffRequest_userId_fkey";

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AnnouncementCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementReactedUser" ADD CONSTRAINT "AnnouncementReactedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementReactedUser" ADD CONSTRAINT "AnnouncementReactedUser_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachments" ADD CONSTRAINT "Attachments_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompaniesBranch" ADD CONSTRAINT "CompaniesBranch_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompaniesBranch" ADD CONSTRAINT "CompaniesBranch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recognition" ADD CONSTRAINT "Recognition_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionLikeComment" ADD CONSTRAINT "RecognitionLikeComment_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "Recognition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionUser" ADD CONSTRAINT "RecognitionUser_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "Recognition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionUser" ADD CONSTRAINT "RecognitionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SurveyQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "SurveyAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeOffRequest" ADD CONSTRAINT "TimeOffRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
