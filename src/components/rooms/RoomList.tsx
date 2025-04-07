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
    return [...rooms].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.pricePerHour - b.pricePerHour
        case 'priceDesc':
          return b.pricePerHour - a.pricePerHour
        default: // recommended
          // デフォルトは価格の安い順
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