'use client'

import { generateTwoWeeksAvailability } from "./AvailabilityCalendar"
import AvailabilityCalendar from "./AvailabilityCalendar"
import type { Room } from "@prisma/client"

type Props = {
  room: Room
  onDateSelect?: (date: Date) => void
  selectedDate?: Date | null
}

export default function RoomAvailabilitySection({ room, onDateSelect, selectedDate }: Props) {
  const availability = generateTwoWeeksAvailability()

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <AvailabilityCalendar 
        availabilityData={availability}
        onDateClick={onDateSelect}
        selectedDate={selectedDate || undefined}
      />
    </div>
  )
} 