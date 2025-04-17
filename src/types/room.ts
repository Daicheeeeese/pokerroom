import { Room as PrismaRoom } from '@prisma/client'

export type Room = PrismaRoom & {
  images: {
    id: string
    url: string
    order: number
    roomId: string
    createdAt: Date
    updatedAt: Date
  }[]
  hourlyPrices: {
    id: string
    hour: number
    price: number
    roomId: string
    createdAt: Date
    updatedAt: Date
  }[]
  hourlyPricesHoliday: {
    id: string
    hour: number
    price: number
    roomId: string
    createdAt: Date
    updatedAt: Date
  }[]
  availability: {
    id: string
    date: Date
    isAvailable: boolean
    roomId: string
    createdAt: Date
    updatedAt: Date
  }[]
  reviews: {
    id: string
    rating: number
    comment: string
    userId: string
    roomId: string
    createdAt: Date
    updatedAt: Date
  }[]
  tags: {
    id: string
    name: string
    rooms: Room[]
  }[]
}

export type RoomWithDetails = Room & {
  averageRating: number
  totalReviews: number
  isAvailable: boolean
  nextAvailableDate: Date | null
}

export type RoomImage = {
  id: string
  url: string
  order: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type HourlyPrice = {
  id: string
  hour: number
  price: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type HourlyPriceHoliday = {
  id: string
  hour: number
  price: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type RoomAvailability = {
  id: string
  date: Date
  isAvailable: boolean
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type Review = {
  id: string
  rating: number
  comment: string
  userId: string
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type Tag = {
  id: string
  name: string
  rooms: Room[]
} 