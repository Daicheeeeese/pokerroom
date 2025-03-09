import { NextResponse } from 'next/server'
import { format, addDays } from 'date-fns'
import { sql } from '@/lib/db'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const date = searchParams.get('date')
  const guests = searchParams.get('guests')

  try {
    // 検索条件を構築
    const conditions: Prisma.RoomWhereInput[] = []

    // エリア検索条件
    if (area) {
      conditions.push({
        name: { contains: area }
      })
    }

    // 人数検索条件
    if (guests) {
      conditions.push({
        capacity: { gte: parseInt(guests) }
      })
    }

    // Prismaクエリ
    const rooms = await prisma.room.findMany({
      where: conditions.length > 0 ? { AND: conditions } : {},
      include: {
        reviews: true,
        reservations: date ? {
          where: {
            date: new Date(date as string)
          }
        } : false
      }
    })

    // 日付が指定されている場合、予約済みのルームをフィルタリング
    const filteredRooms = date
      ? rooms.filter(room => {
          return !room.reservations?.length
        })
      : rooms

    // reservationsフィールドを除外して返す
    const sanitizedRooms = filteredRooms.map(({ reservations, ...room }) => room)

    return NextResponse.json(sanitizedRooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
} 