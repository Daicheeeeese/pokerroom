"use client"

import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/navigation"

type Room = {
  id: string
  name: string
  description: string
  image: string
  capacity: number
  pricePerHour: number
  createdAt: Date
  updatedAt: Date
}

type Props = {
  room: Room
}

export default function ReservationForm({ room }: Props) {
  const router = useRouter()
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotalPrice = () => {
    if (!startTime || !endTime) return 0
    const [startHour] = startTime.split(":").map(Number)
    const [endHour] = endTime.split(":").map(Number)
    const hours = endHour - startHour
    return hours * room.pricePerHour
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime) {
      setError("全ての項目を入力してください")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          date: date.toISOString(),
          startTime,
          endTime,
          totalPrice: calculateTotalPrice(),
        }),
      })

      if (!response.ok) {
        throw new Error("予約に失敗しました")
      }

      router.push("/reservations")
    } catch (error) {
      setError(error instanceof Error ? error.message : "予約に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholderText="日付を選択"
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
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <option key={hour} value={`${hour}:00`}>
              {`${hour}:00`}
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
          {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
            <option key={hour} value={`${hour}:00`}>
              {`${hour}:00`}
            </option>
          ))}
        </select>
      </div>

      {startTime && endTime && (
        <div className="text-lg font-semibold">
          合計: ¥{calculateTotalPrice().toLocaleString()}
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}

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