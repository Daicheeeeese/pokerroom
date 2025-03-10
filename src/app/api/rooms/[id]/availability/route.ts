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
    const datesParam = searchParams.get('dates')
    
    if (!datesParam) {
      return NextResponse.json(
        { error: 'Dates parameter is required' },
        { status: 400 }
      )
    }

    const dates = datesParam.split(',').map(date => {
      try {
        return new Date(date)
      } catch (error) {
        console.error(`Invalid date format: ${date}`)
        return null
      }
    }).filter((date): date is Date => date !== null)

    if (dates.length === 0) {
      return NextResponse.json(
        { error: 'No valid dates provided' },
        { status: 400 }
      )
    }

    // 指定された日付の予約可能状態を取得
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomId: params.id,
        date: {
          in: dates
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
          date: date.toISOString(),
          isAvailable: true
        }))
      )
    }

    return NextResponse.json(
      availabilities.map(a => ({
        ...a,
        date: a.date.toISOString()
      }))
    )
  } catch (error) {
    console.error('Error fetching room availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 