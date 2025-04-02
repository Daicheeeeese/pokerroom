"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import type { Room, User, HourlyPriceWeekday, HourlyPriceHoliday } from "@prisma/client"
import { useRouter } from "next/navigation"

type RoomWithPrices = Room & {
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
}

type Props = {
  room: RoomWithPrices
  user: User
  date: string
  startTime: string
  endTime: string
  totalPrice: string
}

export default function ReservationConfirmForm({ room, user, date, startTime, endTime, totalPrice }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch("/api/reservations", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("予約の作成に失敗しました")
      }

      toast.success("予約を受け付けました。詳細は予約メールをご確認ください")
      router.push("/reservations")
    } catch (error) {
      console.error("予約エラー:", error)
      toast.error("予約の作成に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">予約の確認</h1>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{room.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">予約日</p>
              <p className="font-medium">
                {format(new Date(date), "yyyy年MM月dd日")}
              </p>
            </div>
            <div>
              <p className="text-gray-600">時間</p>
              <p className="font-medium">
                {startTime} 〜 {endTime}
              </p>
            </div>
            <div>
              <p className="text-gray-600">料金</p>
              <p className="font-medium">¥{parseInt(totalPrice).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">予約者</p>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">部屋の詳細</h3>
          <p className="text-gray-600 mb-2">{room.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">収容人数</p>
              <p className="font-medium">{room.capacity}人</p>
            </div>
            <div>
              <p className="text-gray-600">時間単価</p>
              <p className="font-medium">¥{room.pricePerHour.toLocaleString()}/時間</p>
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
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "予約処理中..." : "予約を確定する"}
          </button>
          <p className="text-sm text-gray-600 text-center mt-4">
            送信後、予約メールが届きますのでご確認ください。
          </p>
        </form>
      </div>
    </div>
  )
} 