'use client'

import { useState, useEffect } from "react"
import { generateTwoWeeksAvailability } from "./AvailabilityCalendar"
import AvailabilityCalendar from "./AvailabilityCalendar"
import type { Room } from "@prisma/client"

type Props = {
  room: Room
  onDateSelect?: (date: Date | null) => void
  selectedDate?: Date | null
}

export default function RoomAvailabilitySection({ room, onDateSelect, selectedDate }: Props) {
  const [availabilityData, setAvailabilityData] = useState<{ date: Date; isAvailable: boolean }[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        console.log('API Response:', data)

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
            console.log('Comparing dates:', { dateStr, apiDateStr, isMatch: dateStr === apiDateStr })
            return dateStr === apiDateStr
          })
          const result = {
            date,
            isAvailable: availabilityData?.isAvailable ?? true
          }
          console.log('Availability for date:', { date: dateStr, result })
          return result
        })

        console.log('Final availability data:', availability)
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

  const handleDateSelect = (date: Date | null) => {
    if (!date) {
      onDateSelect?.(null)
      return
    }

    // 選択された日付の予約可能状態をチェック
    const dateStr = date.toISOString().split('T')[0]
    const dateAvailability = availabilityData.find(
      a => a.date.toISOString().split('T')[0] === dateStr
    )

    if (dateAvailability?.isAvailable) {
      onDateSelect?.(date)
    } else {
      alert('選択された日付は予約できません。')
      onDateSelect?.(null)
    }
  }

  if (isLoading) {
    return <div className="bg-gray-25 p-4 rounded-lg">読み込み中...</div>
  }

  return (
    <div className="bg-gray-25 p-4 rounded-lg">
      <AvailabilityCalendar 
        availabilityData={availabilityData}
        onDateClick={handleDateSelect}
        selectedDate={selectedDate || undefined}
      />

    </div>
  )
} 