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
    
    // 時間を分単位に変換
    const [startHour, startMinute = 0] = startTime.split(":").map(Number)
    const [endHour, endMinute = 0] = endTime.split(":").map(Number)
    const startTotalMinutes = (startHour * 60) + Number(startMinute)
    const endTotalMinutes = (endHour * 60) + Number(endMinute)
    
    // 時間帯別料金がある場合はそれを使用し、ない場合はデフォルトの時間単価を使用
    let total = 0
    if (room.hourlyPrices && room.hourlyPrices.length > 0) {
      // 30分単位で料金を計算
      for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
        const hour = Math.floor(minutes / 60)
        const hourlyPrice = room.hourlyPrices.find(
          price => price.hour === hour
        )
        // 30分あたりの料金を加算
        total += (hourlyPrice ? hourlyPrice.price : room.pricePerHour) / 2
      }
    } else {
      // デフォルトの時間単価を使用（30分単位）
      const durationInHours = (endTotalMinutes - startTotalMinutes) / 60
      total = durationInHours * room.pricePerHour
    }
    
    return Math.floor(total) // 小数点以下を切り捨て
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
    const [startHour, startMinute = 0] = startTime.split(":").map(Number)
    const [endHour, endMinute = 0] = endTime.split(":").map(Number)
    const startTotalMinutes = (startHour * 60) + Number(startMinute)
    const endTotalMinutes = (endHour * 60) + Number(endMinute)
    
    if (startTotalMinutes >= endTotalMinutes) {
      setError("終了時間は開始時間より後にしてください")
      return
    }

    const totalPrice = calculateTotalPrice()
    const params = new URLSearchParams({
      roomId: room.id,
      roomName: room.name,
      date,
      startTime,
      endTime,
      totalPrice: totalPrice.toString(),
    })

    router.push(`/reservations/confirm?${params.toString()}`)
  }

  // 30分単位の時間オプションを生成する関数
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      options.push(
        <option key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
          {`${hour.toString().padStart(2, '0')}:00`}
        </option>
      )
      options.push(
        <option key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
          {`${hour.toString().padStart(2, '0')}:30`}
        </option>
      )
    }
    return options
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
          {generateTimeOptions()}
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
          {generateTimeOptions()}
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

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "予約処理中..." : session?.user?.id ? "予約（まだ請求されません）" : "予約"}
        </button>
        {!session?.user?.id && (
          <div className="text-center text-sm text-gray-600">
            予約するには<a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">ログイン</a>が必要です
          </div>
        )}
      </div>
    </form>
  )
} 