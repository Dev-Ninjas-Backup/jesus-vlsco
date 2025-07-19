-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('MILESTONE', 'GOOD_JOB', 'ANNIVERSARY', 'PROMOTION');

-- CreateEnum
CREATE TYPE "VisibilityType" AS ENUM ('Only_Recipient', 'All_user_in_the_company', 'Specific_user_in_the_company');

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "iconImage" TEXT NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recognition" (
    "id" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "visibility" "VisibilityType" NOT NULL,
    "shouldNotify" BOOLEAN NOT NULL,
    "isAllowedToLike" BOOLEAN NOT NULL,

    CONSTRAINT "Recognition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecognitionUser" (
    "recognitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RecognitionUser_pkey" PRIMARY KEY ("recognitionId","userId")
);

-- AddForeignKey
ALTER TABLE "Recognition" ADD CONSTRAINT "Recognition_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionUser" ADD CONSTRAINT "RecognitionUser_recognitionId_fkey" FOREIGN KEY ("recognitionId") REFERENCES "Recognition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionUser" ADD CONSTRAINT "RecognitionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
