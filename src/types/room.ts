import type { Room, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Tag } from '@prisma/client'

export type RoomWithDetails = Room & {
  reviews: Review[]
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  tags: Tag[]
  pricePerHour: number | null
} 