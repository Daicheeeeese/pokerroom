/*
  Warnings:

  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Place";

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_roomId_key" ON "Score"("roomId");

-- CreateIndex
CREATE INDEX "Score_roomId_idx" ON "Score"("roomId");
