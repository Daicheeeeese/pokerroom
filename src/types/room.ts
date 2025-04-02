import type { Room as PrismaRoom, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, NearestStation } from '@prisma/client'

export type RoomWithDetails = {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  address: string
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  reviews: Review[]
  nearestStations: NearestStation[]
  createdAt: Date
  updatedAt: Date
  pricePerHour: number
}

export interface Room {
  id: string
  name: string
  description: string
  capacity: number
  price: number
  pricePerHour: number
  createdAt: Date
  updatedAt: Date
} 