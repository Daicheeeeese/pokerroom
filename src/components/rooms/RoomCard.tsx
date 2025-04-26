"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { Review } from "@prisma/client"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type RoomWithReviews = {
  id: string
  name: string
  description: string | null
  image: string | null
  pricePerHour: number
  capacity: number
  reviews: Review[]
  address?: string | null
  prefecture?: string | null
  city?: string | null
  images?: { url: string }[]
}

type Props = {
  room: RoomWithReviews
  selectedDate?: Date | null
}

export default function RoomCard({ room, selectedDate }: Props) {
  const images = room.images?.length 
    ? room.images.map(img => img.url)
    : [room.image || '/placeholder.png']

  const averageRating = room.reviews.length > 0
    ? room.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / room.reviews.length
    : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <Link href={`/rooms/${room.id}${selectedDate ? `?date=${selectedDate.toISOString().split('T')[0]}` : ''}`}>
        <div className="relative h-48">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full">
                  <Image
                    src={image}
                    alt={`${room.name} - 画像${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
          {(room.prefecture || room.city || room.address) && (
            <div className="flex items-start gap-1 mb-2 text-gray-600">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">
                {[room.prefecture, room.city, room.address]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            </div>
          )}
          <p className="text-gray-600 mb-2 line-clamp-2">{room.description}</p>
          <div className="flex justify-between items-center mb-2">
            <p className="text-blue-600 font-semibold">
              ¥{room.pricePerHour.toLocaleString()}~/時間
            </p>
            {averageRating && (
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-500">
            最大{room.capacity}人
          </p>
        </div>
      </Link>
    </div>
  )
} 