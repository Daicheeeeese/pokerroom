/*
  Warnings:

  - The primary key for the `hourly_prices_holiday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hour` on the `hourly_prices_holiday` table. All the data in the column will be lost.
  - The primary key for the `hourly_prices_weekday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hour` on the `hourly_prices_weekday` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `room_images` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `prefecture` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerHour` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `hourly_prices_holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `hourly_prices_holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `hourly_prices_weekday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `hourly_prices_weekday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `rooms` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `rooms` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "hourly_prices_holiday_roomid_hour_key";

-- DropIndex
DROP INDEX "hourly_prices_weekday_roomid_hour_key";

-- AlterTable
ALTER TABLE "hourly_prices_holiday" DROP CONSTRAINT "hourly_prices_holiday_pkey",
DROP COLUMN "hour",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "hourly_prices_holiday_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "hourly_prices_weekday" DROP CONSTRAINT "hourly_prices_weekday_pkey",
DROP COLUMN "hour",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "hourly_prices_weekday_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "room_images" DROP COLUMN "caption",
ALTER COLUMN "order" DROP DEFAULT;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "city",
DROP COLUMN "image",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "prefecture",
DROP COLUMN "basePrice",
ADD COLUMN     "nearestStation" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_roomId_idx" ON "reviews"("roomId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");
