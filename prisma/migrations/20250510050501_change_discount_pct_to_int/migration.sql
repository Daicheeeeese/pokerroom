/*
  Warnings:

  - You are about to alter the column `discountPct` on the `duration_discounts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "duration_discounts" ALTER COLUMN "discountPct" SET DATA TYPE INTEGER;
