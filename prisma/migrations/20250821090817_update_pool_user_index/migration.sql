/*
  Warnings:

  - A unique constraint covering the columns `[poolId,userId]` on the table `poolUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "poolUser_poolId_userId_key" ON "poolUser"("poolId", "userId");
