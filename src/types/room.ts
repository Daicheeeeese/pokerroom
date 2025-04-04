import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Review } from "@prisma/client"

export type RoomWithDetails = {
  id: string
  name: string
  description: string
  address: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  availableFrom: string
  availableTo: string
  createdAt: Date
  updatedAt: Date
  images: RoomImage[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  reviews: Review[]
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