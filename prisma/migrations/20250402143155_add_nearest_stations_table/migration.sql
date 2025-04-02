/*
  Warnings:

  - You are about to drop the column `nearestStation` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "nearestStation";

-- CreateTable
CREATE TABLE "nearest_stations" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transport" TEXT NOT NULL,
    "minutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nearest_stations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nearest_stations_roomId_idx" ON "nearest_stations"("roomId");
