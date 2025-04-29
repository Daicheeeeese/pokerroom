"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Room } from '@prisma/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface RoomCardProps {
  room: Room & {
    images: { url: string }[]
  }
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
          <p className="text-gray-600 mb-2">{room.address}</p>
          <p className="text-lg font-semibold text-primary">
            ¥{room.pricePerHour.toLocaleString()}/時間
          </p>
        </div>
      </div>
    </Link>
  )
} 