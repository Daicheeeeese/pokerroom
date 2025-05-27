/*
  Warnings:

  - You are about to drop the column `people` on the `reservations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reservationCode]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "people",
ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "reservationCode" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservationCode_key" ON "reservations"("reservationCode");
