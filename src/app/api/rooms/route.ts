import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// このルートを動的に設定
export const dynamic = 'force-dynamic'

// 1ページあたりの表示件数
const ITEMS_PER_PAGE = 6

export async function GET(request: Request) {
  console.log('API Route: GET /api/rooms started')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Database URL:', process.env.DATABASE_URL?.slice(0, 30) + '...')

  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area')
    const date = searchParams.get('date')
    const guests = searchParams.get('guests')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

    console.log('Search params:', { area, date, guests, page })

    // 検索条件を構築
    const where: Prisma.RoomWhereInput = {}

    // エリア検索条件
    if (area) {
      where.OR = [
        { address: { contains: area } }
      ]
    }

    // 人数検索条件
    if (guests) {
      where.capacity = { gte: parseInt(guests) }
    }

    console.log('Search conditions:', JSON.stringify(where))

    // データベース接続テスト
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }

    // 総件数を取得
    const totalCount = await prisma.room.count({ where })
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    // Prismaクエリ
    console.log('Executing Prisma query with conditions:', JSON.stringify(where, null, 2))
    
    const rooms = await prisma.room.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      skip,
      take: ITEMS_PER_PAGE
    })

    console.log('Found rooms count:', rooms.length)
    console.log('Found rooms:', rooms.map(room => ({
      id: room.id,
      name: room.name,
      baseprice: room.baseprice,
      image: room.images[0]?.url
    })))

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
          return { 
            ...room, 
            hasReservation: reservations.length > 0,
            image: room.images[0]?.url || null
          }
        }))
      : rooms.map(room => ({ 
          ...room, 
          hasReservation: false,
          image: room.images[0]?.url || null
        }))

    console.log('Filtered rooms count:', filteredRooms.length)
    console.log('Filtered rooms:', filteredRooms.map(room => ({
      id: room.id,
      name: room.name,
      hasReservation: room.hasReservation
    })))

    // 予約済みのルームをフィルタリング
    const availableRooms = date
      ? filteredRooms.filter(room => !room.hasReservation)
      : filteredRooms

    console.log('Available rooms count:', availableRooms.length)
    console.log('Available rooms:', availableRooms.map(room => ({
      id: room.id,
      name: room.name
    })))
    
    const response = {
      rooms: availableRooms.map(({ hasReservation, ...room }) => room),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
    
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
  } finally {
    await prisma.$disconnect()
  }
} 