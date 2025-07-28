/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `DefaultShift` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DefaultShift_userId_projectId_key" ON "DefaultShift"("userId", "projectId");
