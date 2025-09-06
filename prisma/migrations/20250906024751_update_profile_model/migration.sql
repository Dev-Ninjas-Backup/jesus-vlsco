/*
  Warnings:

  - Changed the type of `jobTitle` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Department" ADD VALUE 'LABOURER';
ALTER TYPE "Department" ADD VALUE 'CARPENTER';
ALTER TYPE "Department" ADD VALUE 'ELECTRICIAN';
ALTER TYPE "Department" ADD VALUE 'DRIVER';

-- DropForeignKey
ALTER TABLE "CompaniesBranch" DROP CONSTRAINT "CompaniesBranch_managerId_fkey";

-- AlterTable
ALTER TABLE "CompaniesBranch" ALTER COLUMN "managerId" DROP NOT NULL;

-- AlterTable: safely convert enum to text
ALTER TABLE "Profile"
ALTER COLUMN "jobTitle" TYPE TEXT
USING "jobTitle"::TEXT;

-- DropEnum (safe to drop after conversion)
DROP TYPE "JopTitle";

-- AddForeignKey
ALTER TABLE "CompaniesBranch" ADD CONSTRAINT "CompaniesBranch_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
