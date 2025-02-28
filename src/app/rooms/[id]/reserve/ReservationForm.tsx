"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import Image from "next/image"
import { Calendar } from "@/components/Calendar"
import { useSession } from "next-auth/react"
import { room } from "@prisma/client"

type Props = {
  room: room
}

export function ReservationForm({ room }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState("10")
  const [endTime, setEndTime] = useState("11")
  const [isLoading, setIsLoading] = useState(false)

  const handleReservation = async () => {
    if (!session?.user) {
      router.push("/login")
      return
    }

    if (!selectedDate) {
      alert("日付を選択してください")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          date: selectedDate,
          startTime: parseInt(startTime),
          endTime: parseInt(endTime),
        }),
      })

      if (!response.ok) {
        throw new Error("予約に失敗しました")
      }

      router.push("/bookings")
    } catch (error) {
      alert("予約に失敗しました。もう一度お試しください。")
    } finally {
      setIsLoading(false)
    }
  }

  // 料金計算
  const calculateTotalPrice = () => {
    const hours = parseInt(endTime) - parseInt(startTime)
    return room.price * hours
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">予約</h1>
        
        {/* 選択中のルーム情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-6">
            <div className="relative w-40 h-40">
              <Image
                src={room.imageUrl}
                alt={room.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600 mb-2">{room.area}</p>
              <p className="text-blue-600 font-semibold">¥{room.price.toLocaleString()}/時間</p>
            </div>
          </div>
        </div>

        {/* 予約フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">予約情報の入力</h3>
          
          {/* 日付選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              利用日
            </label>
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {selectedDate && (
              <p className="mt-2 text-sm text-gray-600">
                選択中: {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })}
              </p>
            )}
          </div>

          {/* 時間選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              利用時間
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">開始時間</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {`${i.toString().padStart(2, "0")}:00`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">終了時間</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {`${i.toString().padStart(2, "0")}:00`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 料金表示 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">合計金額</span>
              <span className="text-xl font-bold">
                ¥{calculateTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>

          {/* 予約ボタン */}
          <button
            type="button"
            onClick={handleReservation}
            disabled={isLoading || !selectedDate}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "予約処理中..." : "予約する"}
          </button>
        </div>
      </div>
    </div>
  )
} 