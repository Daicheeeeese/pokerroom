"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Room } from '@prisma/client'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface RoomCardProps {
  room: Room & {
    images: { url: string }[]
    nearestStations: {
      id: string
      name: string
      transport: string
      minutes: number
      createdAt: Date
      updatedAt: Date
      roomId: string
    }[]
    unit: string
  }
  selectedDate: Date | null
}

export default function RoomCard({ room, selectedDate }: RoomCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // デバッグ用のログを追加
  useEffect(() => {
    console.log('RoomCard received room:', {
      id: room.id,
      name: room.name,
      nearestStations: room.nearestStations
    })
  }, [room])

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
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              pagination={{
                clickable: true,
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              className="h-full"
            >
              {room.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image.url || '/images/placeholder.jpg'}
                    alt={`${room.name} - 画像${index + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
          <p className="text-gray-600 mb-2">{room.address}</p>
          {room.nearestStations && room.nearestStations.length > 0 && (
            <p className="text-gray-600 mb-2">
              {room.nearestStations[0].name}駅徒歩{room.nearestStations[0].minutes}分
            </p>
          )}
          <p className="text-lg font-semibold text-primary">
            ¥{room.baseprice.toLocaleString()}/{room.unit === 'hour' ? '時間' : '人'}
          </p>
        </div>
      </div>
    </Link>
  )
} 