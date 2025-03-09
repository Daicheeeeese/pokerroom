"use client"

import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"
import type { Room } from "@/app/rooms/[id]/page"

type Props = {
  room: Room
  selectedDate?: Date | null
}

export default function ReservationForm({ room, selectedDate }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [date, setDate] = useState(selectedDate ? selectedDate.toISOString().split('T')[0] : '')
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  // selectedDateが変更されたら、dateを更新
  if (selectedDate && selectedDate.toISOString().split('T')[0] !== date) {
    setDate(selectedDate.toISOString().split('T')[0])
  }

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

    if (!session?.user?.id) {
      setError("ログインが必要です")
      return
    }

    // 開始時間と終了時間の検証
    const [startHour] = startTime.split(":").map(Number)
    const [endHour] = endTime.split(":").map(Number)
    if (startHour >= endHour) {
      setError("終了時間は開始時間より後にしてください")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log("予約リクエスト送信開始")
      const requestData = {
        roomId: room.id,
        date: date,
        startTime,
        endTime,
        totalPrice: calculateTotalPrice(),
        userId: session.user.id,
      }
      console.log("送信データ:", {
        ...requestData,
        userId: session.user.id,
        userEmail: session.user.email
      })

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      })

      const data = await response.json()
      console.log("予約レスポンス:", data)

      if (!response.ok) {
        console.error("予約エラーレスポンス:", data)
        console.error("レスポンスステータス:", response.status)
        console.error("レスポンスヘッダー:", Object.fromEntries(response.headers.entries()))
        const errorMessage = data.error || "予約に失敗しました"
        console.error("エラーメッセージ:", errorMessage)
        throw new Error(errorMessage)
      }

      setSuccess("予約が成功しました。")
      router.refresh()
    } catch (error) {
      console.error("予約エラー:", error)
      const errorMessage = error instanceof Error ? error.message : "予約に失敗しました"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md whitespace-pre-wrap">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md whitespace-pre-wrap">
          {success}
        </div>
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