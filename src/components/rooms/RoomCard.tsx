"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useRef } from "react"
import type { Review } from "@prisma/client"
import { MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  
  // 画像の取得
  const images = room.images?.length 
    ? room.images.map(img => img.url)
    : [room.image || '/placeholder.png']

  const averageRating = room.reviews.length > 0
    ? room.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / room.reviews.length
    : null

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setSlideDirection('right')
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setSlideDirection('left')
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50 // 最小スワイプ距離

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 左スワイプ
        setSlideDirection('left')
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else {
        // 右スワイプ
        setSlideDirection('right')
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
    }

    // リセット
    touchStartX.current = 0
    touchEndX.current = 0
  }

  const handleAnimationEnd = () => {
    setSlideDirection(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <Link href={`/rooms/${room.id}${selectedDate ? `?date=${selectedDate.toISOString().split('T')[0]}` : ''}`}>
        <div 
          className="relative h-48 group overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
              slideDirection === 'left' ? 'translate-x-[-100%]' : 
              slideDirection === 'right' ? 'translate-x-[100%]' : 
              'translate-x-0'
            }`}
            onTransitionEnd={handleAnimationEnd}
          >
            <Image
              src={images[currentImageIndex]}
              alt={room.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
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