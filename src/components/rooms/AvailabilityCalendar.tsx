"use client"

import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { useEffect, useState } from "react"
import { RoomBusinessHours } from "@prisma/client"

type DayAvailability = {
  date: Date
  isAvailable: boolean
  businessHours?: RoomBusinessHours[]
}

type Props = {
  roomId: string
  selectedDate?: Date | null
  onDateSelect: (date: Date | null) => void
  businessHours: RoomBusinessHours[]
}

export default function AvailabilityCalendar({ roomId, selectedDate, onDateSelect, businessHours }: Props) {
  const [availabilityData, setAvailabilityData] = useState<DayAvailability[]>([])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/availability`)
        if (!response.ok) {
          throw new Error('Failed to fetch availability data')
        }
        const data = await response.json()
        setAvailabilityData(data.map((item: any) => ({
          date: new Date(item.date),
          isAvailable: item.isAvailable,
          businessHours: getBusinessHoursForDay(new Date(item.date))
        })))
      } catch (error) {
        console.error('Error fetching availability:', error)
        // エラー時は仮のデータを表示
        setAvailabilityData(generateTwoWeeksAvailability())
      }
    }

    fetchAvailability()
  }, [roomId])

  // 曜日に基づいて営業時間を取得する関数
  const getBusinessHoursForDay = (date: Date) => {
    const dayOfWeek = date.getDay()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayName = dayNames[dayOfWeek]
    
    return businessHours.filter(hours => hours.day === dayName)
  }

  // 営業時間を表示する関数
  const formatBusinessHours = (hours: RoomBusinessHours[] | undefined) => {
    if (!hours || hours.length === 0) return null
    
    const sortedHours = [...hours].sort((a, b) => a.openTime.localeCompare(b.openTime))
    return sortedHours.map(h => `${formatTime(h.openTime)}~${formatTime(h.closeTime)}`).join(', ')
  }

  // 時間をフォーマットする関数
  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">空き状況</h3>
        <div className="flex gap-4">
          <div className="flex items-center text-sm">
            <span className="inline-block w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-1">
              ○
            </span>
            <span>予約可能</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="inline-block w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mr-1">
              ×
            </span>
            <span>予約不可</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* 曜日の表示 */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}

        {/* 日付の表示 */}
        {availabilityData.map(({ date, isAvailable, businessHours }) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const isPast = date < today
          const hasBusinessHours = businessHours && businessHours.length > 0
          const hoursDisplay = formatBusinessHours(businessHours)

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              disabled={!isAvailable || isPast || !hasBusinessHours}
              className={`
                p-2 text-center rounded-md transition-colors
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${!isAvailable || isPast || !hasBusinessHours ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-100 text-green-800 hover:bg-green-200'}
              `}
            >
              <div className="text-sm">
                {format(date, 'd')}
              </div>
              <div className="text-xs mt-1">
                {hoursDisplay || '営業時間なし'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 仮の予約状況を生成する関数（後でAPIから取得するように変更）
export function generateTwoWeeksAvailability() {
  const today = new Date()
  const twoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const isAvailable = Math.random() > 0.5
    return { date, isAvailable }
  })
  return twoWeeks
}

export type { DayAvailability } 