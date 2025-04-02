"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import type { Room, User, HourlyPriceWeekday, HourlyPriceHoliday } from "@prisma/client"

type RoomWithPrices = Room & {
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
}

type Props = {
  searchParams: {
    roomId: string
    date: string
    startTime: string
    endTime: string
    totalPrice: string
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = false

export default function ReservationConfirmPage({ searchParams }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [room, setRoom] = useState<RoomWithPrices | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const { roomId } = searchParams
        if (!roomId) {
          router.push('/')
          return
        }

        const [roomResponse, userResponse] = await Promise.all([
          fetch(`/api/rooms/${roomId}`),
          fetch(`/api/users/${session.user.id}`)
        ])

        if (!roomResponse.ok || !userResponse.ok) {
          throw new Error('データの取得に失敗しました')
        }

        const [roomData, userData] = await Promise.all([
          roomResponse.json(),
          userResponse.json()
        ])

        setRoom(roomData)
        setUser(userData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('データの読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session, router, searchParams])

  const { date, startTime, endTime, totalPrice } = searchParams

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!room || !user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          データの読み込みに失敗しました
        </div>
      </div>
    )
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

        <form action="/api/reservations" method="POST" className="space-y-4">
          <input type="hidden" name="roomId" value={room.id} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="startTime" value={startTime} />
          <input type="hidden" name="endTime" value={endTime} />
          <input type="hidden" name="totalPrice" value={totalPrice} />
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            予約を確定する
          </button>
        </form>
      </div>
    </div>
  )
} 