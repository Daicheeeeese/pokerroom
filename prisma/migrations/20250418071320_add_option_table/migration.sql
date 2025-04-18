-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "priceType" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Option_roomId_idx" ON "Option"("roomId");
