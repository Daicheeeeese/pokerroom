/*
  Warnings:

  - You are about to drop the column `availableFrom` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `availableTo` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "availableFrom",
DROP COLUMN "availableTo",
ALTER COLUMN "amenities" DROP DEFAULT;

-- CreateTable
CREATE TABLE "room_business_hours" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "dayType" TEXT NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "room_business_hours_roomId_idx" ON "room_business_hours"("roomId");
