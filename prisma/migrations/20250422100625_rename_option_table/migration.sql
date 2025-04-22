/*
  Warnings:

  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Option";

-- CreateTable
CREATE TABLE "option" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceType" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);
