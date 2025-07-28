-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMembers" DROP CONSTRAINT "TeamMembers_userId_fkey";

-- CreateTable
CREATE TABLE "_TeamToTeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamToTeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamMembersToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembersToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamToTeamMembers_B_index" ON "_TeamToTeamMembers"("B");

-- CreateIndex
CREATE INDEX "_TeamMembersToUser_B_index" ON "_TeamMembersToUser"("B");

-- AddForeignKey
ALTER TABLE "_TeamToTeamMembers" ADD CONSTRAINT "_TeamToTeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToTeamMembers" ADD CONSTRAINT "_TeamToTeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "TeamMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembersToUser" ADD CONSTRAINT "_TeamMembersToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "TeamMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembersToUser" ADD CONSTRAINT "_TeamMembersToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
