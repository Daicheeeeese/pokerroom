-- DropTable
DROP TABLE IF EXISTS "hourly_prices" CASCADE;
DROP TABLE IF EXISTS "hourly_prices_weekday" CASCADE;
DROP TABLE IF EXISTS "hourly_prices_holiday" CASCADE;
DROP TABLE IF EXISTS "Holiday" CASCADE;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "hourly_prices_weekday" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "roomId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hourly_prices_weekday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_prices_holiday" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "roomId" TEXT NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hourly_prices_holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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