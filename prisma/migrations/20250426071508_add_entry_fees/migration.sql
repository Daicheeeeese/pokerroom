-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duration_discounts" (
    "id" TEXT NOT NULL,
    "minHours" INTEGER NOT NULL,
    "discountPct" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "duration_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "early_bird_discounts" (
    "id" TEXT NOT NULL,
    "cutoffStart" TEXT NOT NULL,
    "cutoffEnd" TEXT NOT NULL,
    "discountPct" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "early_bird_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extension_rates" (
    "id" TEXT NOT NULL,
    "minHours" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "extension_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "minimum_persons" (
    "id" TEXT NOT NULL,
    "minPeople" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "minimum_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_fees" (
    "id" TEXT NOT NULL,
    "feePerPerson" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "entry_fees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "holidays_date_idx" ON "holidays"("date");

-- CreateIndex
CREATE INDEX "duration_discounts_roomId_idx" ON "duration_discounts"("roomId");

-- CreateIndex
CREATE INDEX "early_bird_discounts_roomId_idx" ON "early_bird_discounts"("roomId");

-- CreateIndex
CREATE INDEX "extension_rates_roomId_idx" ON "extension_rates"("roomId");

-- CreateIndex
CREATE INDEX "minimum_persons_roomId_idx" ON "minimum_persons"("roomId");

-- CreateIndex
CREATE INDEX "entry_fees_roomId_idx" ON "entry_fees"("roomId");
