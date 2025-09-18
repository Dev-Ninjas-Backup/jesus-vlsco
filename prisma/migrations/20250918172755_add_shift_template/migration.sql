-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "allDay" SET DEFAULT false;

-- CreateTable
CREATE TABLE "ShiftTemplate" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "locationLng" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "templateTitle" TEXT NOT NULL,
    "job" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShiftTemplate_pkey" PRIMARY KEY ("id")
);
