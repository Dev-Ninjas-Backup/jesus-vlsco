/*
  Warnings:

  - You are about to drop the `PayrollEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PayrollEntry" DROP CONSTRAINT "PayrollEntry_payrollId_fkey";

-- DropForeignKey
ALTER TABLE "PayrollEntry" DROP CONSTRAINT "PayrollEntry_shiftId_fkey";

-- DropTable
DROP TABLE "PayrollEntry";

-- CreateTable
CREATE TABLE "PayrollEntries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "regularHours" DOUBLE PRECISION NOT NULL,
    "overtimeHours" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollEntries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollEntries" ADD CONSTRAINT "PayrollEntries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
