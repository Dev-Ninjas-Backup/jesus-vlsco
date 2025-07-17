/*
  Warnings:

  - The `breakTimePerDay` column on the `Payroll` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the column `offDay` on the `Payroll` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- CreateEnum
CREATE TYPE "BreakTimePerDay" AS ENUM ('NONE', 'HALF_HOUR', 'ONE_HOUR', 'TWO_HOUR', 'THREE_HOUR');

-- Fix the type change from scalar to array
ALTER TABLE "Payroll"
  ALTER COLUMN "offDay"
  SET DATA TYPE "Weekdays"[]
  USING ARRAY["offDay"]::text[]::"Weekdays"[];

-- AlterTable (split correctly)
ALTER TABLE "Payroll"
  ALTER COLUMN "offDay" SET DEFAULT ARRAY['SATURDAY', 'SUNDAY']::"Weekdays"[],
  ALTER COLUMN "numberOffDay" SET DEFAULT 2,
  DROP COLUMN "breakTimePerDay",
  ADD COLUMN "breakTimePerDay" "BreakTimePerDay" NOT NULL DEFAULT 'NONE',
  ALTER COLUMN "regularPayRate" SET DEFAULT 1,
  ALTER COLUMN "regularPayRateType" SET DEFAULT 'HOUR',
  ALTER COLUMN "overTimePayRate" SET DEFAULT 1,
  ALTER COLUMN "overTimePayRateType" SET DEFAULT 'HOUR',
  ALTER COLUMN "casualLeave" SET DEFAULT 2,
  ALTER COLUMN "sickLeave" SET DEFAULT 2;


