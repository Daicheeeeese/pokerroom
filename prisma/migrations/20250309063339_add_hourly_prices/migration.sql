-- CreateTable
CREATE TABLE "HourlyPrice" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL,
    "endHour" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HourlyPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HourlyPrice_roomId_startHour_endHour_key" ON "HourlyPrice"("roomId", "startHour", "endHour");

-- AddForeignKey
ALTER TABLE "HourlyPrice" ADD CONSTRAINT "HourlyPrice_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
