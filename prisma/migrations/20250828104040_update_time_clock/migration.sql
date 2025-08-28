-- CreateEnum
CREATE TYPE "RequestOverTimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "RequestOverTime" ADD COLUMN     "status" "RequestOverTimeStatus" NOT NULL DEFAULT 'PENDING';
