-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PayrollEntry" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "regularHours" DOUBLE PRECISION NOT NULL,
    "overtimeHours" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PayrollStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PayrollEntry" ADD CONSTRAINT "PayrollEntry_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEntry" ADD CONSTRAINT "PayrollEntry_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
