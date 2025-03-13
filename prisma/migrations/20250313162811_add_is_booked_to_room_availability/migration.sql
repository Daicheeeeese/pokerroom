/*
  Warnings:

  - You are about to drop the `room_availability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "room_availability";

-- CreateTable
CREATE TABLE "room_availabilities" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_availabilities_roomId_date_key" ON "room_availabilities"("roomId", "date");
