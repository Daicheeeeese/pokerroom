"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage } from "@prisma/client"

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
}

type Props = {
  room: RoomWithDetails
  selectedDate?: Date | null
}

export default function ReservationForm({ room, selectedDate }: Props) {
  const router = useRouter()
  const [date, setDate] = useState<Date | null>(selectedDate || null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")

  const calculateTotalPrice = () => {
    if (!date || !startTime || !endTime) return 0

    const isHoliday = date.getDay() === 0 || date.getDay() === 6
    const hourlyPrices = isHoliday ? room.hourlyPricesHoliday : room.hourlyPricesWeekday

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    let totalPrice = 0
    const startHour = start.getHours()
    const startMinutes = start.getMinutes()

    for (let i = 0; i < diffHours * 2; i++) {
      const currentMinutes = startMinutes + i * 30
      const currentHour = startHour + Math.floor(currentMinutes / 60)
      const timeString = `${currentHour.toString().padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`

      const hourlyPrice = hourlyPrices.find(price => price.startTime <= timeString && price.endTime > timeString)
      totalPrice += hourlyPrice ? hourlyPrice.price / 2 : room.pricePerHour / 2
    }

    return totalPrice
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!date || !startTime || !endTime) {
      setError("日付と時間を選択してください")
      setIsSubmitting(false)
      return
    }

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)

    if (end <= start) {
      setError("終了時間は開始時間より後である必要があります")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          date: date.toISOString().split("T")[0],
          startTime,
          endTime,
          totalPrice: calculateTotalPrice(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "予約に失敗しました")
      }

      const data = await response.json()
      setSuccessMessage("予約が完了しました")
      router.push(`/reservations/${data.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "予約に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        options.push(timeString)
      }
    }
    return options
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <DatePicker
          selected={date}
          onChange={(date: Date | null) => setDate(date)}
          minDate={new Date()}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          dateFormat="yyyy/MM/dd"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">開始時間</label>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">終了時間</label>
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {date && startTime && endTime && (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            合計金額: ¥{calculateTotalPrice().toLocaleString()}
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "予約中..." : "予約する"}
      </button>
    </form>
  )
} 