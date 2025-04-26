"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Room } from "@prisma/client"
import DatePicker from "@/components/DatePicker"
import TimePicker from "@/components/TimePicker"

type Props = {
  room: Room
}

export function ReservationForm({ room }: Props) {
  const router = useRouter()
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const calculateTotalPrice = () => {
    if (!startTime || !endTime) return 0
    const [startHour] = startTime.split(":").map(Number)
    const [endHour] = endTime.split(":").map(Number)
    const hours = endHour - startHour
    return room.pricePerHour * hours
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !startTime || !endTime) return

    try {
      setIsSubmitting(true)
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
      console.error(error)
      alert("予約に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          予約日
        </label>
        <DatePicker
          selected={date}
          onChange={setDate}
          minDate={new Date()}
          placeholderText="利用日を選択"
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            開始時間
          </label>
          <TimePicker
            value={startTime}
            onChange={setStartTime}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            終了時間
          </label>
          <TimePicker
            value={endTime}
            onChange={setEndTime}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      {startTime && endTime && (
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">合計金額</span>
            <span className="text-xl font-bold">
              ¥{calculateTotalPrice().toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={!date || !startTime || !endTime || isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "予約中..." : "予約を確定する"}
      </button>
    </form>
  )
} 