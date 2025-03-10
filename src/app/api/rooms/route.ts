import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// このルートを動的に設定
export const dynamic = 'force-dynamic'

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
    console.log('Executing Prisma query with conditions:', JSON.stringify(where, null, 2))
    
    const rooms = await prisma.room.findMany({
      where,
      include: {
        reviews: true
      }
    })

    console.log('Raw rooms data:', JSON.stringify(rooms, null, 2))
    console.log(`Found ${rooms.length} rooms`)

    // 日付が指定されている場合、予約済みのルームをフィルタリング
    const filteredRooms = date
      ? await Promise.all(rooms.map(async (room) => {
          console.log(`Checking reservations for room ${room.id}`)
          const reservations = await prisma.reservation.findMany({
            where: {
              roomId: room.id,
              date: new Date(date)
            }
          })
          console.log(`Room ${room.id} has ${reservations.length} reservations`)
          return { ...room, hasReservation: reservations.length > 0 }
        }))
      : rooms.map(room => ({ ...room, hasReservation: false }))

    console.log('Filtered rooms:', JSON.stringify(filteredRooms, null, 2))
    console.log(`Final room count: ${filteredRooms.length}`)

    // 予約済みのルームをフィルタリング
    const availableRooms = date
      ? filteredRooms.filter(room => !room.hasReservation)
      : filteredRooms

    console.log('Available rooms:', JSON.stringify(availableRooms, null, 2))
    
    const response = availableRooms.map(({ hasReservation, ...room }) => room)
    console.log('Final response:', JSON.stringify(response, null, 2))
    
    return NextResponse.json(response)
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