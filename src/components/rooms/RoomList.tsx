"use client"

import Image from "next/image"
import Link from "next/link"
import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { useState, useEffect } from "react"

type AvailabilityStatus = "available" | "few" | "unavailable"

type Room = {
  id: number
  name: string
  area: string
  address: string
  price: number
  capacity: number
  rating: number
  reviewCount: number
  facilities: string[]
  imageUrl: string
  availability: Record<string, AvailabilityStatus>
}

type AvailabilityIcon = {
  icon: string
  label: string
  className: string
}

// 仮のデータ
const rooms: Room[] = [
  {
    id: 1,
    name: "渋谷ポーカールーム",
    area: "渋谷",
    address: "東京都渋谷区渋谷1-1-1",
    price: 3000,
    capacity: 8,
    rating: 4.5,
    reviewCount: 32,
    facilities: ["tournament-chips", "food", "drink", "wifi"],
    imageUrl: "/images/rooms/room-sample-01.jpg",
    availability: {
      "2024-03-19": "available",
      "2024-03-20": "few",
      "2024-03-21": "unavailable",
      "2024-03-22": "available",
      "2024-03-23": "few",
      "2024-03-24": "unavailable",
      "2024-03-25": "available",
      "2024-03-26": "available",
      "2024-03-27": "few",
      "2024-03-28": "unavailable",
      "2024-03-29": "available",
      "2024-03-30": "few",
      "2024-03-31": "available",
      "2024-04-01": "available",
    },
  },
  {
    id: 2,
    name: "新宿ポーカースペース",
    area: "新宿",
    address: "東京都新宿区新宿2-2-2",
    price: 5000,
    capacity: 12,
    rating: 4.2,
    reviewCount: 28,
    facilities: ["tournament-chips", "cash-chips", "timer", "food", "drink"],
    imageUrl: "/images/rooms/room-sample-02.jpg",
    availability: {
      "2024-03-19": "few",
      "2024-03-20": "available",
      "2024-03-21": "available",
      "2024-03-22": "unavailable",
      "2024-03-23": "available",
      "2024-03-24": "few",
      "2024-03-25": "unavailable",
      "2024-03-26": "available",
      "2024-03-27": "available",
      "2024-03-28": "few",
      "2024-03-29": "unavailable",
      "2024-03-30": "available",
      "2024-03-31": "few",
      "2024-04-01": "available",
    },
  },
  // 他のルームデータ...
]

const availabilityIcons: Record<AvailabilityStatus, AvailabilityIcon> = {
  available: { icon: "⭕️", label: "予約可能", className: "text-green-600" },
  few: { icon: "△", label: "残りわずか", className: "text-yellow-600" },
  unavailable: { icon: "✕", label: "予約不可", className: "text-red-600" },
}

export function RoomList() {
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        if (!response.ok) {
          throw new Error('Failed to fetch rooms')
        }
        const data = await response.json()
        setRooms(data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 検索結果数とソート */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{rooms.length}件の検索結果</p>
        <select className="border rounded-lg px-3 py-2">
          <option value="recommended">おすすめ順</option>
          <option value="price_asc">料金が安い順</option>
          <option value="price_desc">料金が高い順</option>
          <option value="rating">評価が高い順</option>
        </select>
      </div>

      {/* ルーム一覧 */}
      <div className="space-y-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* 左側：画像と基本情報 */}
              <div className="md:w-2/3">
                <Link href={`/rooms/${room.id}`}>
                  <div className="flex flex-col md:flex-row">
                    {/* 画像 */}
                    <div className="relative w-full md:w-64 h-48">
                      <Image
                        src={room.imageUrl}
                        alt={room.name}
                        fill
                        className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                      />
                    </div>

                    {/* 詳細情報 */}
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                          <p className="text-gray-600 mb-2">{room.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            ¥{room.price.toLocaleString()}
                            <span className="text-sm font-normal text-gray-600">
                              /時間
                            </span>
                          </p>
                          <p className="text-sm text-gray-600">
                            最大{room.capacity}人
                          </p>
                        </div>
                      </div>

                      {/* 評価 */}
                      <div className="mt-4 flex items-center">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 font-semibold">{room.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-gray-600">
                          {room.reviewCount}件の評価
                        </span>
                      </div>

                      {/* 設備アイコン */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.facilities.map((facility) => (
                          <span
                            key={facility}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* 右側：予約可能状況 */}
              <div className="md:w-1/3 border-t md:border-t-0 md:border-l">
                <div className="p-4">
                  <p className="text-sm font-semibold mb-3">予約可能状況</p>
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="inline-flex gap-1 pb-2">
                      {dates.map((date) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        const status = room.availability[dateStr] || "unavailable"
                        const { icon, label, className } = availabilityIcons[status]

                        return (
                          <div
                            key={dateStr}
                            className="flex flex-col items-center min-w-[45px] p-1 rounded hover:bg-gray-50"
                          >
                            <p className="text-sm text-gray-600">
                              {format(date, "d")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(date, "E", { locale: ja })}
                            </p>
                            <p
                              className={`text-base font-bold ${className} mt-1`}
                              title={`${format(date, "M/d")} ${label}`}
                            >
                              {icon}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={`/rooms/${room.id}`}
                      className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      空き状況・予約へ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 