import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('API Route: GET /api/rooms/[id] started')
  console.log('Room ID:', params.id)
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Database URL:', process.env.DATABASE_URL?.slice(0, 30) + '...')

  try {
    // データベース接続テスト
    try {
      await prisma.$connect()
      console.log('Database connection successful')
    } catch (error) {
      console.error('Database connection failed:', error)
      throw error
    }

    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        hourlyPricesWeekday: true,
        hourlyPricesHoliday: true,
        options: {
          select: {
            id: true,
            option: true,
            price: true,
            unit: true,
            isRequired: true,
          }
        },
      },
    })

    console.log('Room found:', room ? 'Yes' : 'No')

    if (!room) {
      return NextResponse.json(
        { error: "ルームが見つかりません" },
        { status: 404 }
      )
    }

    // optionsをフラット化
    const flattenedRoom = {
      ...room,
      options: room.options.map(opt => ({
        id: opt.id,
        name: opt.option,
        price: opt.price,
        unit: opt.unit,
        isRequired: opt.isRequired,
      }))
    }

    return NextResponse.json(flattenedRoom)
  } catch (error) {
    console.error("Error fetching room:", error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    return NextResponse.json(
      { 
        error: "ルームの取得に失敗しました",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}