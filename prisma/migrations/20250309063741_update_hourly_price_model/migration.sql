/*
  Warnings:

  - You are about to drop the column `endHour` on the `HourlyPrice` table. All the data in the column will be lost.
  - You are about to drop the column `startHour` on the `HourlyPrice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,hour]` on the table `HourlyPrice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hour` to the `HourlyPrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "HourlyPrice_roomId_startHour_endHour_key";

-- AlterTable
ALTER TABLE "HourlyPrice" DROP COLUMN "endHour",
DROP COLUMN "startHour",
ADD COLUMN     "hour" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HourlyPrice_roomId_hour_key" ON "HourlyPrice"("roomId", "hour");
