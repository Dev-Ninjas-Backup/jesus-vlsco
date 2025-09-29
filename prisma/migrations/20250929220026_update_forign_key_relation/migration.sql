-- DropForeignKey
ALTER TABLE "public"."TaskComment" DROP CONSTRAINT "TaskComment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TeamAnnouncement" DROP CONSTRAINT "TeamAnnouncement_announcementId_fkey";

-- AddForeignKey
ALTER TABLE "public"."TaskComment" ADD CONSTRAINT "TaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "public"."Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
