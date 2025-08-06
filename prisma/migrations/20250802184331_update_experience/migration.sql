/*
  Warnings:

  - You are about to drop the column `jobTitle` on the `Experience` table. All the data in the column will be lost.
  - Added the required column `jobType` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE');

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "jobTitle",
ADD COLUMN     "jobType" "JobType" NOT NULL;
