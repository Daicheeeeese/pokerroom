/*
  Warnings:

  - A unique constraint covering the columns `[roomId,hour,dayType]` on the table `hourly_prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dayType` to the `hourly_prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "hourly_prices" DROP CONSTRAINT "hourly_prices_roomId_fkey";

-- DropIndex
DROP INDEX "hourly_prices_roomId_hour_key";

-- AlterTable
ALTER TABLE "hourly_prices" ADD COLUMN     "dayType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_date_key" ON "Holiday"("date");

-- CreateIndex
CREATE UNIQUE INDEX "hourly_prices_roomId_hour_dayType_key" ON "hourly_prices"("roomId", "hour", "dayType");

-- AddForeignKey
ALTER TABLE "hourly_prices" ADD CONSTRAINT "hourly_prices_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
