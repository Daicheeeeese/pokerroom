-- AlterTable
ALTER TABLE "hourly_prices" RENAME CONSTRAINT "HourlyPrice_pkey" TO "hourly_prices_pkey";

-- AlterTable
ALTER TABLE "reservations" RENAME CONSTRAINT "Reservation_pkey" TO "reservations_pkey";

-- AlterTable
ALTER TABLE "reviews" RENAME CONSTRAINT "Review_pkey" TO "reviews_pkey";

-- AlterTable
ALTER TABLE "room_availabilities" RENAME CONSTRAINT "RoomAvailability_pkey" TO "room_availabilities_pkey";

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "prefecture" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";

-- RenameForeignKey
ALTER TABLE "hourly_prices" RENAME CONSTRAINT "HourlyPrice_roomId_fkey" TO "hourly_prices_roomId_fkey";

-- RenameForeignKey
ALTER TABLE "reservations" RENAME CONSTRAINT "Reservation_roomId_fkey" TO "reservations_roomId_fkey";

-- RenameForeignKey
ALTER TABLE "reservations" RENAME CONSTRAINT "Reservation_userId_fkey" TO "reservations_userId_fkey";

-- RenameForeignKey
ALTER TABLE "reviews" RENAME CONSTRAINT "Review_roomId_fkey" TO "reviews_roomId_fkey";

-- RenameForeignKey
ALTER TABLE "room_availabilities" RENAME CONSTRAINT "RoomAvailability_roomId_fkey" TO "room_availabilities_roomId_fkey";

-- RenameIndex
ALTER INDEX "HourlyPrice_roomId_hour_key" RENAME TO "hourly_prices_roomId_hour_key";

-- RenameIndex
ALTER INDEX "RoomAvailability_roomId_date_key" RENAME TO "room_availabilities_roomId_date_key";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
