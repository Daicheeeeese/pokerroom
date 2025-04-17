/*
  Warnings:

  - Added the required column `day` to the `room_business_hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "room_business_hours" ADD COLUMN     "day" TEXT NOT NULL;
