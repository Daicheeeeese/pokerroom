import type { Room as PrismaRoom, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, NearestStation } from '@prisma/client'

export type RoomWithDetails = {
  id: string
  name: string
  description: string
  capacity: number
  address: string
  pricePerHour: number
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  reviews: Review[]
  nearestStations: NearestStation[]
  createdAt: Date
  updatedAt: Date
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