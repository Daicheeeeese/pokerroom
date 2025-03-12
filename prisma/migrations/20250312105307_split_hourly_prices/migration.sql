-- CreateTable
CREATE TABLE "hourly_prices_weekday" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roomId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hourly_prices_weekday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_prices_holiday" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roomId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hourly_prices_holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hourly_prices_weekday_roomId_hour_key" ON "hourly_prices_weekday"("roomId", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "hourly_prices_holiday_roomId_hour_key" ON "hourly_prices_holiday"("roomId", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_date_key" ON "Holiday"("date");

-- AddForeignKey
ALTER TABLE "hourly_prices_weekday" ADD CONSTRAINT "hourly_prices_weekday_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_prices_holiday" ADD CONSTRAINT "hourly_prices_holiday_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE; 