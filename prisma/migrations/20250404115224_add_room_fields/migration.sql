/*
  Warnings:

  - You are about to drop the column `price` on the `hourly_prices_holiday` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `hourly_prices_weekday` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `pricePerHour` to the `hourly_prices_holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerHour` to the `hourly_prices_weekday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerHour` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hourly_prices_holiday" DROP COLUMN "price",
ADD COLUMN     "pricePerHour" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "hourly_prices_weekday" DROP COLUMN "price",
ADD COLUMN     "pricePerHour" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "price",
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "availableFrom" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN     "availableTo" TEXT NOT NULL DEFAULT '21:00',
ADD COLUMN     "pricePerHour" INTEGER NOT NULL;
