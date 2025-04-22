/*
  Warnings:

  - The primary key for the `rooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `roomId` on the `hourly_prices_holiday` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `hourly_prices_weekday` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `nearest_stations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `option` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `reservations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `room_business_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roomId` on the `room_images` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "hourly_prices_holiday" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hourly_prices_weekday" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "nearest_stations" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "option" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_business_hours" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "room_images" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "nearest_stations_roomId_idx" ON "nearest_stations"("roomId");

-- CreateIndex
CREATE INDEX "reservations_roomId_idx" ON "reservations"("roomId");

-- CreateIndex
CREATE INDEX "reviews_roomId_idx" ON "reviews"("roomId");

-- CreateIndex
CREATE INDEX "room_business_hours_roomId_idx" ON "room_business_hours"("roomId");
