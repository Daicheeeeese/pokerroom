import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const dates = searchParams.get('dates')?.split(',')

    if (!dates) {
      return NextResponse.json(
        { error: 'Dates parameter is required' },
        { status: 400 }
      )
    }

    // 指定された日付の予約可能状態を取得
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomId: params.id,
        date: {
          in: dates.map(date => new Date(date))
        }
      },
      select: {
        date: true,
        isAvailable: true
      }
    })

    return NextResponse.json(availabilities)
  } catch (error) {
    console.error('Error fetching room availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 