import { NextResponse } from 'next/server'
import { format, addDays } from 'date-fns'
import { sql } from '@/lib/db'

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
    
    const { rows: rooms } = await sql`
      SELECT 
        r.*,
        COALESCE(AVG(rev.rating), 0) as average_rating,
        COUNT(rev.id) as review_count
      FROM "Room" r
      LEFT JOIN "Review" rev ON r.id = rev."roomId"
      GROUP BY r.id
    `

    console.log('Rooms fetched:', rooms)

    if (!rooms || rooms.length === 0) {
      console.log('No rooms found')
      return NextResponse.json([])
    }

    // 可用性データを追加
    const roomsWithAvailability = rooms.map(room => ({
      ...room,
      rating: parseFloat(room.average_rating),
      reviewCount: parseInt(room.review_count),
      availability: generateAvailability(),
    }))

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