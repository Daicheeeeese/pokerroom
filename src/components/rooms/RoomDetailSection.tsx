'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Review } from "@prisma/client"
import AvailabilityCalendar from "./AvailabilityCalendar"
import ReservationForm from "../ReservationForm"
import { Card } from '@/components/ui/card'
import { Users, Clock } from 'lucide-react'
import { formatPricePerHour } from '@/lib/format'

type RoomWithDetails = {
  id: string
  name: string
  description: string
  address: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  availableFrom: string
  availableTo: string
  createdAt: Date
  updatedAt: Date
  images: RoomImage[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  reviews: Review[]
}

type Props = {
  room: RoomWithDetails
  selectedDate?: Date | null
}

export default function RoomDetailSection({ room, selectedDate }: Props) {
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(selectedDate || null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={room.images && room.images.length > 0 ? room.images[0].url : '/placeholder.png'}
              alt={room.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {room.images?.slice(1).map((image, index) => (
              <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={`${room.name} - 画像 ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPinIcon className="h-5 w-5 text-gray-500" />
            <p className="text-gray-600">
              {room.address}
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">料金</h2>
            <p className="text-2xl font-bold text-blue-600">
              {formatPricePerHour(room.pricePerHour)}/時間
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ※土日祝日や時間帯により料金が変動する場合があります
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">収容人数</h2>
            <p className="text-gray-600">最大{room.capacity}人</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">予約</h2>
            <ReservationForm room={room} selectedDate={selectedDateState} />
          </div>
        </div>
      </div>
    </div>
  )
} 