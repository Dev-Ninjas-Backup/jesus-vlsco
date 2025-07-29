/*
  Warnings:

  - You are about to drop the `Shift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- DropTable
DROP TABLE "Shift";

-- CreateTable
CREATE TABLE "DefaultShift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shiftType" "ShiftType" NOT NULL DEFAULT 'MORNING',
    "shiftDuration" INTEGER NOT NULL DEFAULT 8,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultShift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "shiftType" "ShiftType" NOT NULL,
    "shiftDuration" INTEGER NOT NULL,
    "status" "ShiftStatus" NOT NULL DEFAULT 'PENDING',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultShift_userId_key" ON "DefaultShift"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftLog_userId_date_key" ON "ShiftLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "DefaultShift" ADD CONSTRAINT "DefaultShift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftLog" ADD CONSTRAINT "ShiftLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
