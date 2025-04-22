/*
  Warnings:

  - You are about to drop the column `isRequired` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `option` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Option_roomId_idx";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "isRequired",
DROP COLUMN "option",
DROP COLUMN "priceType",
DROP COLUMN "roomId",
DROP COLUMN "unit",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "rooms";

-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "pricePerHour" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_options" (
    "id" SERIAL NOT NULL,
    "reservationId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservation_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomOption" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_options_reservationId_optionId_key" ON "reservation_options"("reservationId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomOption_roomId_optionId_key" ON "RoomOption"("roomId", "optionId");
