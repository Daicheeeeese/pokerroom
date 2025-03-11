"use client"

import Image from "next/image"
import Link from "next/link"
import type { Review, Tag } from "@prisma/client"
import AvailabilitySlider from "./AvailabilitySlider"
import { useState, useEffect } from "react"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { RoomTags } from './RoomTags'

type RoomWithReviewsAndTags = {
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
  tags: Tag[]
}

type Props = {
  room: RoomWithReviewsAndTags
  selectedDate?: Date | null
}

export default function RoomCard({ room, selectedDate }: Props) {
  const [availabilityData, setAvailabilityData] = useState<{ date: Date; isAvailable: boolean }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // tagsのデフォルト値を設定
  const tags = room.tags || []

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // 今日から2週間分の日付を生成
        const dates = Array.from({ length: 14 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + i)
          date.setHours(0, 0, 0, 0)
          return date
        })

        // 予約可能状態を取得
        const response = await fetch(`/api/rooms/${room.id}/availability?dates=${dates.map(d => d.toISOString()).join(',')}`)
        const data = await response.json()

        // データが配列でない場合のエラーハンドリング
        if (!Array.isArray(data)) {
          console.error('Invalid API response format:', data)
          throw new Error('Invalid API response format')
        }

        // 日付ごとの予約可能状態をマッピング
        const availability = dates.map(date => {
          const dateStr = date.toISOString().split('T')[0]
          const availabilityData = data.find((a: { date: string; isAvailable: boolean }) => {
            const apiDateStr = new Date(a.date).toISOString().split('T')[0]
            return dateStr === apiDateStr
          })
          return {
            date,
            isAvailable: availabilityData?.isAvailable ?? true
          }
        })

        setAvailabilityData(availability)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching availability:', error)
        // エラー時はすべての日付を利用可能として表示
        const dates = Array.from({ length: 14 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() + i)
          date.setHours(0, 0, 0, 0)
          return { date, isAvailable: true }
        })
        setAvailabilityData(dates)
        setIsLoading(false)
      }
    }

    fetchAvailability()
  }, [room.id])

  const averageRating = room.reviews.length > 0
    ? room.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / room.reviews.length
    : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/rooms/${room.id}${selectedDate ? `?date=${selectedDate.toISOString().split('T')[0]}` : ''}`}>
        <div className="relative h-48">
          <Image
            src={room.image || '/placeholder.png'}
            alt={room.name}
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
          <div className="mb-2">
            <RoomTags tags={room.tags} />
          </div>
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
              ¥{(room.pricePerHour ?? 0).toLocaleString()}~/時間
            </p>
            {averageRating && (
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 mb-3">
            最大{room.capacity}人
          </p>
        </div>
      </Link>
      <div className="border-t px-4 py-3">
        <p className="text-sm text-gray-600 mb-2">空き状況</p>
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">読み込み中...</div>
        ) : (
          <AvailabilitySlider availabilityData={availabilityData} />
        )}
      </div>
    </div>
  )
} 