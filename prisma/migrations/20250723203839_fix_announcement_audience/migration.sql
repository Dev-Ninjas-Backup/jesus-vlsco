/*
  Warnings:

  - You are about to drop the column `audience` on the `Announcement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "audience",
ADD COLUMN     "isForAllUsers" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TeamAnnouncement" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "announcementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamAnnouncement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
