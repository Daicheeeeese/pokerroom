-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'hour';

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "extra" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notes_roomId_idx" ON "notes"("roomId");
