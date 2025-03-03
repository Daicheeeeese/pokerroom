"use client"

import Image from "next/image"
import Link from "next/link"
import { type Room as PrismaRoom, type Review } from "@prisma/client"

type RoomWithReviews = PrismaRoom & {
  reviews: Review[]
}

type Props = {
  room: RoomWithReviews
}

export default function RoomCard({ room }: Props) {
  const averageRating = room.reviews.length > 0
    ? room.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / room.reviews.length
    : null

  return (
    <Link
      href={`/rooms/${room.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image
          src={room.image}
          alt={room.name}
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
        <p className="text-gray-600 mb-2">{room.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-blue-600 font-semibold">
            ¥{room.pricePerHour.toLocaleString()}/時間
          </p>
          {averageRating && (
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-gray-500 mt-2">
          最大{room.capacity}人
        </p>
      </div>
    </Link>
  )
} 