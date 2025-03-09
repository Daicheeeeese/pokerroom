/*
  Warnings:

  - You are about to drop the column `address` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `facilities` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Room` table. All the data in the column will be lost.
  - Added the required column `image` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerHour` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "address",
DROP COLUMN "area",
DROP COLUMN "facilities",
DROP COLUMN "imageUrl",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "price",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "pricePerHour" INTEGER NOT NULL;
