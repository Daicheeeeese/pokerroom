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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

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

  // 自動スライド
  useEffect(() => {
    if (isVisible && room.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, room.images.length])

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <Link href={`/rooms/${room.id}${selectedDate ? `?date=${format(selectedDate, 'yyyy-MM-dd')}` : ''}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div ref={imageRef} className="relative aspect-video">
          {isVisible && (
            <Image
              src={room.images[currentImageIndex]?.url || '/images/placeholder.jpg'}
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
          {room.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {room.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    handleDotClick(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
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