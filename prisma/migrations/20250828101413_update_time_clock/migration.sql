-- AlterTable
ALTER TABLE "TimeClock" ADD COLUMN     "isOvertimeAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "overtimeHours" DOUBLE PRECISION,
ADD COLUMN     "totalHours" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "RequestOverTime" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeClockId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestOverTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestOverTime" ADD CONSTRAINT "RequestOverTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestOverTime" ADD CONSTRAINT "RequestOverTime_timeClockId_fkey" FOREIGN KEY ("timeClockId") REFERENCES "TimeClock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
