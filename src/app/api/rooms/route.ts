import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area')
  const date = searchParams.get('date')
  const guests = searchParams.get('guests')

  try {
    // 検索条件を構築
    const conditions: Prisma.RoomWhereInput[] = []

    // エリア検索条件（都道府県、市区町村、住所で検索）
    if (area) {
      conditions.push({
        OR: [
          { prefecture: { contains: area } },
          { city: { contains: area } },
          { address: { contains: area } }
        ]
      })
    }

    // 人数検索条件
    if (guests) {
      conditions.push({
        capacity: { gte: parseInt(guests) }
      })
    }

    console.log('Executing query with conditions:', JSON.stringify(conditions))

    // Prismaクエリ
    const rooms = await prisma.room.findMany({
      where: conditions.length > 0 ? { AND: conditions } : {},
      include: {
        reviews: true,
        reservations: date ? {
          where: {
            date: new Date(date)
          }
        } : false,
        hourlyPrices: true
      }
    })

    console.log(`Found ${rooms.length} rooms`)

    // 日付が指定されている場合、予約済みのルームをフィルタリング
    const filteredRooms = date
      ? rooms.filter(room => !room.reservations?.length)
      : rooms

    // reservationsフィールドを除外して返す
    const sanitizedRooms = filteredRooms.map(({ reservations, ...room }) => room)

    return NextResponse.json(sanitizedRooms)
  } catch (error) {
    console.error('Error details:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma known error:', {
        code: error.code,
        message: error.message,
        meta: error.meta
      })
      return NextResponse.json(
        { error: `Database error: ${error.code}`, message: error.message, meta: error.meta },
        { status: 500 }
      )
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Prisma initialization error:', {
        message: error.message,
        errorCode: error.errorCode
      })
      return NextResponse.json(
        { 
          error: 'Database initialization error', 
          message: error.message,
          errorCode: error.errorCode
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 