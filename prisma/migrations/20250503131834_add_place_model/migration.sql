-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "totalRatings" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roomId" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_placeId_key" ON "Place"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_roomId_key" ON "Place"("roomId");

-- CreateIndex
CREATE INDEX "Place_placeId_idx" ON "Place"("placeId");
