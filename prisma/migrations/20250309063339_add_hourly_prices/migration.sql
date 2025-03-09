-- CreateTable
CREATE TABLE "hourly_prices" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hourly_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hourly_prices_roomId_hour_key" ON "hourly_prices"("roomId", "hour");

-- AddForeignKey
ALTER TABLE "hourly_prices" ADD CONSTRAINT "hourly_prices_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 