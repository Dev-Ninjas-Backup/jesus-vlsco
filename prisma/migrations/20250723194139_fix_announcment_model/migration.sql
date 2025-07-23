/*
  Warnings:

  - You are about to drop the `AnnoucementReactedUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnnoucementReactedUser" DROP CONSTRAINT "AnnoucementReactedUser_announcementId_fkey";

-- DropForeignKey
ALTER TABLE "AnnoucementReactedUser" DROP CONSTRAINT "AnnoucementReactedUser_userId_fkey";

-- DropTable
DROP TABLE "AnnoucementReactedUser";

-- CreateTable
CREATE TABLE "AnnouncementReactedUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnnouncementReactedUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnnouncementReactedUser" ADD CONSTRAINT "AnnouncementReactedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementReactedUser" ADD CONSTRAINT "AnnouncementReactedUser_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
