import type { Room, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage } from '@prisma/client'

export type RoomWithDetails = Room & {
  reviews: Review[]
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  pricePerHour: number | null
} 