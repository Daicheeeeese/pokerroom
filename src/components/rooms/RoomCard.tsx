"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Room, Review } from '@prisma/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './RoomCard.css'

type RoomWithReviews = Room & {
  reviews: Review[]
}

interface RoomCardProps {
  room: RoomWithReviews
  selectedDate: Date | null
}

export default function RoomCard({ room, selectedDate }: RoomCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // 画像の遅延読み込み
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  // 平均評価を計算
  const averageRating = room.reviews.length > 0
    ? (room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length).toFixed(1)
    : '0.0'

  return (
    <Link href={`/rooms/${room.id}${selectedDate ? `?date=${format(selectedDate, 'yyyy-MM-dd')}` : ''}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div ref={imageRef} className="relative aspect-video">
          {isVisible && (
            <Image
              src={room.images[0]?.url || '/images/placeholder.jpg'}
              alt={room.name}
              fill
              className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
          <div className="flex items-center mb-2">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">{averageRating}</span>
            <span className="ml-2 text-gray-500">({room.reviews.length}件のレビュー)</span>
          </div>
          <p className="text-gray-600 mb-2">{room.address}</p>
          <p className="text-lg font-semibold text-primary">
            ¥{room.pricePerHour.toLocaleString()}/時間
          </p>
        </div>
      </div>
    </Link>
  )
} 