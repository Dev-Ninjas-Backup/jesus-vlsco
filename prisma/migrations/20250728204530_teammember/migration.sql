/*
  Warnings:

  - You are about to drop the `_TeamMembersToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamToTeamMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TeamMembersToUser" DROP CONSTRAINT "_TeamMembersToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembersToUser" DROP CONSTRAINT "_TeamMembersToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToTeamMembers" DROP CONSTRAINT "_TeamToTeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToTeamMembers" DROP CONSTRAINT "_TeamToTeamMembers_B_fkey";

-- DropTable
DROP TABLE "_TeamMembersToUser";

-- DropTable
DROP TABLE "_TeamToTeamMembers";

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMembers" ADD CONSTRAINT "TeamMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
