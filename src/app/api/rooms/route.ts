import { NextResponse } from 'next/server'
import { format, addDays } from 'date-fns'

// 仮のデータを生成する関数
function generateAvailability() {
  const statuses = ["available", "few", "unavailable"] as const
  const availability: Record<string, typeof statuses[number]> = {}
  
  for (let i = 0; i < 14; i++) {
    const date = addDays(new Date(), i)
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    availability[format(date, 'yyyy-MM-dd')] = randomStatus
  }
  
  return availability
}

// APIハンドラー
export async function GET() {
  const rooms = [
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
      availability: generateAvailability(),
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
      availability: generateAvailability(),
    },
  ]

  return NextResponse.json(rooms)
} 