-- AlterTable
ALTER TABLE "rooms" ADD COLUMN "address" TEXT,
                    ADD COLUMN "prefecture" TEXT,
                    ADD COLUMN "city" TEXT,
                    ADD COLUMN "latitude" DOUBLE PRECISION,
                    ADD COLUMN "longitude" DOUBLE PRECISION; 