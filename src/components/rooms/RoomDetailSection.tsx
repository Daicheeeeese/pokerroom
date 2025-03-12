'use client'

import { useState } from 'react'
import RoomAvailabilitySection from './RoomAvailabilitySection'
import ReservationForm from '../ReservationForm'
import type { Room, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Tag } from '@prisma/client'
import { MapPinIcon } from "@heroicons/react/24/outline"

type RoomWithDetails = Room & {
  reviews: Review[]
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  tags: Tag[]
}

interface Props {
  room: RoomWithDetails
}

export default function RoomDetailSection({ room }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">収容人数</h2>
            <p className="text-3xl font-bold text-blue-600">
              {room.capacity}<span className="text-base font-normal text-gray-600">人まで</span>
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">料金</h2>
            <p className="text-3xl font-bold text-blue-600">
              ¥{(room.pricePerHour ?? 0).toLocaleString()}<span className="text-base font-normal text-gray-600">/時間</span>
            </p>
          </div>
        </div>

        {/* 住所情報 */}
        {(room.prefecture || room.city || room.address) && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">住所</h2>
            <div className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-gray-600" />
              <p className="text-gray-600">
                {[room.prefecture, room.city, room.address]
                  .filter(Boolean)
                  .join(' ')}
              </p>
            </div>
          </div>
        )}

        {/* 空き状況カレンダー */}
        <div>
          <RoomAvailabilitySection 
            room={room}
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        </div>

        {/* 予約フォーム */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">予約</h2>
          <ReservationForm room={room} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  )
} 