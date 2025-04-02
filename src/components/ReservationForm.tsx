"use client"

import { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"
import type { HourlyPriceWeekday, HourlyPriceHoliday } from "@prisma/client"
import { RoomWithDetails } from "@/types/room"

type Props = {
  room: RoomWithDetails
  selectedDate?: Date | null
}

export default function ReservationForm({ room, selectedDate }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")

  useEffect(() => {
    if (selectedDate) {
      const adjustedDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
      setDate(adjustedDate);
    }
  }, [selectedDate]);

  // 開始時間が変更されたら、終了時間をリセット
  useEffect(() => {
    if (startTime && endTime) {
      const [startHour, startMinute = 0] = startTime.split(":").map(Number)
      const [endHour, endMinute = 0] = endTime.split(":").map(Number)
      const startTotalMinutes = (startHour * 60) + Number(startMinute)
      const endTotalMinutes = (endHour * 60) + Number(endMinute)

      if (endTotalMinutes <= startTotalMinutes) {
        setEndTime("")
      }
    }
  }, [startTime])

  const calculateTotalPrice = () => {
    if (!startTime || !endTime || !date) return 0
    
    // 時間を分単位に変換
    const [startHour, startMinute = 0] = startTime.split(":").map(Number)
    const [endHour, endMinute = 0] = endTime.split(":").map(Number)
    const startTotalMinutes = (startHour * 60) + Number(startMinute)
    const endTotalMinutes = (endHour * 60) + Number(endMinute)
    
    // 選択された日付が休日かどうかを判定
    const selectedDate = new Date(date)
    const isHoliday = selectedDate.getDay() === 0 || selectedDate.getDay() === 6 // 土日を休日とする
    
    // 時間帯別料金を取得
    const hourlyPrices = isHoliday ? room.hourlyPricesHoliday : room.hourlyPrices
    
    let total = 0
    // 30分単位で料金を計算
    for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 30) {
      const currentTime = `${Math.floor(minutes / 60).toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}`
      
      // 該当時間の料金を探す
      const hourlyPrice = hourlyPrices.find(price => 
        currentTime >= price.startTime && currentTime < price.endTime
      )
      
      // 該当時間の料金が設定されていない場合はデフォルトの時間単価を使用
      const priceForThisSlot = hourlyPrice?.price ?? room.pricePerHour
      
      // 30分あたりの料金を加算
      total += priceForThisSlot / 2
    }
    
    return Math.floor(total) // 小数点以下を切り捨て
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!date || !startTime || !endTime) {
      setError("日付と時間を選択してください")
      return
    }

    if (!session?.user?.id) {
      setError("ログインが必要です")
      return
    }

    const totalPrice = calculateTotalPrice()
    const searchParams = new URLSearchParams({
      roomId: room.id,
      date: date.toISOString(),
      startTime,
      endTime,
      totalPrice: totalPrice.toString(),
    })

    router.push(`/reservations/confirm?${searchParams.toString()}`)
  }

  // 30分単位の時間オプションを生成する関数
  const generateTimeOptions = (minTime?: string) => {
    const options = []
    const startHour = minTime ? parseInt(minTime.split(":")[0]) : 0
    const startMinute = minTime ? parseInt(minTime.split(":")[1]) : 0
    const startTotalMinutes = (startHour * 60) + startMinute

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const totalMinutes = (hour * 60) + minute
        if (!minTime || totalMinutes > startTotalMinutes) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          options.push(
            <option key={timeString} value={timeString}>
              {timeString}
            </option>
          )
        }
      }
    }
    return options
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <input
          type="date"
          value={date ? date.toISOString().split('T')[0] : ''}
          onChange={(e) => setDate(new Date(e.target.value))}
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
          disabled={!startTime}
        >
          <option value="">選択してください</option>
          {generateTimeOptions(startTime)}
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

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md whitespace-pre-wrap">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? "予約処理中..." : session?.user?.id ? "予約（まだ確定されません）" : "予約"}
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