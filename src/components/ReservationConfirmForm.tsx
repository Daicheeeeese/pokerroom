"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Room, User } from "@prisma/client"

type Props = {
  room: Room
  user: User
  date: string
  startTime: string
  endTime: string
  totalPrice: string
}

export default function ReservationConfirmForm({
  room,
  user,
  date,
  startTime,
  endTime,
  totalPrice,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/reservations", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "予約に失敗しました")
      }

      const data = await response.json()
      router.push(`/reservations/${data.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "予約に失敗しました")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">予約内容の確認</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
            <p className="text-gray-600 mb-2">{room.description}</p>
            <p className="text-gray-600">定員: {room.capacity}名</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">予約内容</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">日付:</span>{" "}
                {new Date(date).toLocaleDateString("ja-JP")}
              </p>
              <p>
                <span className="font-medium">開始時間:</span> {startTime}
              </p>
              <p>
                <span className="font-medium">終了時間:</span> {endTime}
              </p>
              <p>
                <span className="font-medium">合計金額:</span>{" "}
                ¥{parseInt(totalPrice).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="roomId" value={room.id} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="startTime" value={startTime} />
        <input type="hidden" name="endTime" value={endTime} />
        <input type="hidden" name="totalPrice" value={totalPrice} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "予約中..." : "予約を確定する"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          予約送信後、予約メールが届きますのでご確認ください
        </p>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
      </form>
    </div>
  )
} 