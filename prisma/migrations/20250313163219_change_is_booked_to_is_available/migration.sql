/*
  Warnings:

  - You are about to drop the column `isBooked` on the `room_availabilities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "room_availabilities" DROP COLUMN "isBooked",
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
