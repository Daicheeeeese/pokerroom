import { Room, RoomImage, HourlyPriceWeekday, HourlyPriceHoliday, Review, NearestStation, RoomBusinessHours } from '@prisma/client'

export type RoomWithDetails = Room & {
  image?: string
  images: RoomImage[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  reviews: Review[]
  nearestStations: NearestStation[]
  businessHours: RoomBusinessHours[]
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