import { NextResponse } from 'next/server'
import { format, addDays } from 'date-fns'
import { prisma } from '@/lib/prisma'

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
  try {
    console.log('Fetching rooms from database...')
    
    const rooms = await prisma.room.findMany({
      include: {
        reviews: true,
      },
    })

    console.log('Rooms fetched:', rooms)

    if (!rooms || rooms.length === 0) {
      console.log('No rooms found')
      return NextResponse.json([])
    }

    // レビューの平均評価を計算し、可用性データを追加
    const roomsWithAvailability = rooms.map(room => {
      const rating = room.reviews.length > 0
        ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
        : null

      return {
        ...room,
        rating,
        reviewCount: room.reviews.length,
        availability: generateAvailability(),
      }
    })

    console.log('Processed rooms:', roomsWithAvailability)

    return NextResponse.json(roomsWithAvailability)
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch rooms',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 