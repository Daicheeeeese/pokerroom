/*
  Warnings:

  - You are about to drop the column `pricePerHour` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `price` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "pricePerHour",
ADD COLUMN     "price" INTEGER NOT NULL;
