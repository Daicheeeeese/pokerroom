import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// このルートを動的に設定
export const dynamic = 'force-dynamic'

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

    // データが見つからない場合は、すべての日付を利用可能として返す
    if (availabilities.length === 0) {
      return NextResponse.json(
        dates.map(date => ({
          date: new Date(date),
          isAvailable: true
        }))
      )
    }

    return NextResponse.json(availabilities)
  } catch (error) {
    console.error('Error fetching room availability:', error)
    // エラー時はすべての日付を利用可能として返す
    return NextResponse.json(
      dates?.map(date => ({
        date: new Date(date),
        isAvailable: true
      })) || []
    )
  }
} 