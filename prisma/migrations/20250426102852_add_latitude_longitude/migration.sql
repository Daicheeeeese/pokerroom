/*
  Warnings:

  - You are about to drop the `hourly_prices_holiday` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hourly_prices_weekday` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitude` to the `rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "hourly_prices_holiday";

-- DropTable
DROP TABLE "hourly_prices_weekday";
