'use client'

import { useState } from 'react'
import RoomAvailabilitySection from './RoomAvailabilitySection'
import ReservationForm from '../ReservationForm'
import type { Room } from '@/app/rooms/[id]/page'

type Props = {
  room: Room
}

export default function RoomDetailSection({ room }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側: 予約フォーム */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">料金</h2>
            <p className="text-3xl font-bold text-blue-600">
              ¥{room.pricePerHour.toLocaleString()}~<span className="text-base font-normal text-gray-600">/時間</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">最大{room.capacity}人まで利用可能</p>
          </div>
          <ReservationForm room={room} selectedDate={selectedDate} />
        </div>

        {/* 右側: 空き状況カレンダー */}
        <div>
          <h2 className="text-xl font-semibold mb-4">空き状況</h2>
          <RoomAvailabilitySection 
            room={room}
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        </div>
      </div>
    </div>
  )
} 