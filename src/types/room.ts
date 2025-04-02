import type { Room as PrismaRoom, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage } from '@prisma/client'

export type RoomWithDetails = PrismaRoom & {
  reviews: Review[]
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  pricePerHour: number | null
}

export interface Room {
  id: string
  name: string
  description: string
  capacity: number
  pricePerHour: number
  createdAt: Date
  updatedAt: Date
} 