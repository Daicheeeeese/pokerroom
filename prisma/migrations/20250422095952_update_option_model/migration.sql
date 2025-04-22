/*
  Warnings:

  - You are about to drop the column `description` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the `_OptionToRoom` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `option` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceType` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "option" TEXT NOT NULL,
ADD COLUMN     "priceType" TEXT NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL,
ALTER COLUMN "unit" DROP DEFAULT;

-- DropTable
DROP TABLE "_OptionToRoom";
