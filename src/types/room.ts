import { Room as PrismaRoom, RoomImage as PrismaRoomImage, Tag as PrismaTag } from '@prisma/client'

export type RoomImage = PrismaRoomImage

export type RoomOption = {
  id: string
  name: string
  price: number
  unit: string
  isRequired: boolean
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

export type HourlyPriceWeekday = {
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

export type Holiday = {
  id: string
  date: Date
  name: string
  createdAt: Date
  updatedAt: Date
}

export type DurationDiscount = {
  id: string
  minHours: number
  discountPct: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type EarlyBirdDiscount = {
  id: string
  cutoffStart: string
  cutoffEnd: string
  discountPct: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type MinimumReservationTime = {
  id: string
  time: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type MinimumUtilizationNumber = {
  id: string
  number: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type EntryFee = {
  id: string
  feePerPerson: number
  roomId: string
  createdAt: Date
  updatedAt: Date
}

export type Room = Omit<PrismaRoom, 'pricePerHour'> & {
  baseprice: number
  images: RoomImage[]
  options: RoomOption[]
  hourlyPrices: HourlyPrice[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  holidays: Holiday[]
  durationDiscounts: DurationDiscount[]
  earlyBirdDiscounts: EarlyBirdDiscount[]
  minimumReservationTimes: MinimumReservationTime[]
  minimumUtilizationNumbers: MinimumUtilizationNumber[]
  entryFees: EntryFee[]
  tags: {
    tag: PrismaTag
  }[]
  reviews: {
    id: string
    userId: string
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
  }[]
  nearestStations: {
    id: string
    name: string
    transport: string
    minutes: number
    createdAt: Date
    updatedAt: Date
  }[]
  businessHours: {
    id: string
    dayType: string
    openTime: string
    closeTime: string
    day: string
    createdAt: Date
    updatedAt: Date
  }[]
  averageRating: number
  totalReviews: number
  latitude: number
  longitude: number
}

export type RoomWithDetails = Room & {
  images: RoomImage[]
  reviews: Review[]
  nearestStations: NearestStation[]
  businessHours: BusinessHour[]
  options: RoomOption[]
  tags: {
    tag: Tag
  }[]
  score?: {
    rating: number
  }
  unit: string
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