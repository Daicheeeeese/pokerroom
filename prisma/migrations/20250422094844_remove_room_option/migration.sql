/*
  Warnings:

  - You are about to drop the `RoomOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RoomOption";

-- CreateTable
CREATE TABLE "_OptionToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OptionToRoom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OptionToRoom_B_index" ON "_OptionToRoom"("B");
