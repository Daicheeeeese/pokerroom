import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  console.log('API Route: GET /api/rooms started')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Database URL exists:', !!process.env.DATABASE_URL)

  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area')
    const date = searchParams.get('date')
    const guests = searchParams.get('guests')

    console.log('Search params:', { area, date, guests })

    // 検索条件を構築
    const where: Prisma.RoomWhereInput = {}

    // エリア検索条件
    if (area) {
      where.OR = [
        { prefecture: { contains: area } },
        { city: { contains: area } },
        { address: { contains: area } }
      ]
    }

    // 人数検索条件
    if (guests) {
      where.capacity = { gte: parseInt(guests) }
    }

    console.log('Search conditions:', JSON.stringify(where))

    // Prismaクエリ
    const rooms = await prisma.room.findMany({
      where,
      include: {
        reviews: true,
        hourlyPrices: true,
        ...(date ? {
          reservations: {
            where: {
              date: new Date(date)
            }
          }
        } : {})
      }
    })

    console.log(`Found ${rooms.length} rooms`)

    // 日付が指定されている場合、予約済みのルームをフィルタリング
    const filteredRooms = date
      ? rooms.filter(room => !room.reservations?.length)
      : rooms

    console.log(`Final room count: ${filteredRooms.length}`)

    // reservationsフィールドを除外して返す
    const sanitizedRooms = filteredRooms.map(({ reservations, ...room }) => room)

    return NextResponse.json(sanitizedRooms)
  } catch (error) {
    console.error('Error in GET /api/rooms:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma known error:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      })
      return NextResponse.json(
        { error: `Database error: ${error.code}`, message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 