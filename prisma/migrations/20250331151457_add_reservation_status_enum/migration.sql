/*
  Warnings:

  - The `status` column on the `reservations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "status",
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
