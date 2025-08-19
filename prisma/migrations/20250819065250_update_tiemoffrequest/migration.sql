-- CreateEnum
CREATE TYPE "TimeOffRequestType" AS ENUM ('UNPAID', 'SICK_LEAVE', 'CASUAL_LEAVE', 'TIME_OFF');

-- AlterTable
ALTER TABLE "TimeOffRequest" ADD COLUMN     "type" "TimeOffRequestType" NOT NULL DEFAULT 'TIME_OFF';
