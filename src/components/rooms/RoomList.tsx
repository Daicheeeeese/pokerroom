'use client'

import { useState, useMemo } from "react"
import { type Room as PrismaRoom, type Review } from "@prisma/client"
import RoomCard from "./RoomCard"
import SortOptions from "./SortOptions"

type RoomWithReviews = PrismaRoom & {
  reviews: Review[]
}

type Props = {
  rooms: RoomWithReviews[]
}

export default function RoomList({ rooms }: Props) {
  const [sortBy, setSortBy] = useState('recommended')

  const sortedRooms = useMemo(() => {
    const calculateAverageRating = (room: RoomWithReviews) => {
      if (room.reviews.length === 0) return 0
      return room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
    }

    return [...rooms].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.pricePerHour - b.pricePerHour
        case 'priceDesc':
          return b.pricePerHour - a.pricePerHour
        case 'capacityAsc':
          return a.capacity - b.capacity
        case 'capacityDesc':
          return b.capacity - a.capacity
        case 'ratingDesc':
          return calculateAverageRating(b) - calculateAverageRating(a)
        default: // recommended
          // デフォルトは評価と価格を考慮したソート
          const ratingA = calculateAverageRating(a)
          const ratingB = calculateAverageRating(b)
          if (Math.abs(ratingA - ratingB) > 1) {
            return ratingB - ratingA
          }
          return a.pricePerHour - b.pricePerHour
      }
    })
  }, [rooms, sortBy])

  return (
    <div>
      <SortOptions onSort={setSortBy} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  )
} 