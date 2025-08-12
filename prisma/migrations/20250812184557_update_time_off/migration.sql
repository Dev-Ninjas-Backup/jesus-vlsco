-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BadgeCategory" ADD VALUE 'ACHIEVEMENT';
ALTER TYPE "BadgeCategory" ADD VALUE 'AWARD';
ALTER TYPE "BadgeCategory" ADD VALUE 'RECOGNITION';

-- AlterTable
ALTER TABLE "TimeOffRequest" ADD COLUMN     "adminNote" TEXT;
