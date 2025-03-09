'use client'

import type { Room } from "@/app/rooms/[id]/page"
import ReservationForm from "@/components/ReservationForm"
import RoomAvailabilitySection from "./RoomAvailabilitySection"
import { useState } from "react"

type Props = {
  room: Room
}

export default function RoomDetailSection({ room }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">ルーム情報</h2>
          <p>最大{room.capacity}人</p>
          <p>¥{room.pricePerHour.toLocaleString()}/時間</p>
        </div>
        <RoomAvailabilitySection 
          room={room}
          onDateSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
      </div>
      <div>
        <ReservationForm 
          room={room}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  )
} 