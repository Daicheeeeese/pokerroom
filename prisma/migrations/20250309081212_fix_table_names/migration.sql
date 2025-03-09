-- テーブル名を修正
ALTER TABLE IF EXISTS "Room" RENAME TO "rooms";
ALTER TABLE IF EXISTS "User" RENAME TO "users";
ALTER TABLE IF EXISTS "Review" RENAME TO "reviews";
ALTER TABLE IF EXISTS "Reservation" RENAME TO "reservations";
ALTER TABLE IF EXISTS "HourlyPrice" RENAME TO "hourly_prices";
ALTER TABLE IF EXISTS "RoomAvailability" RENAME TO "room_availabilities"; 