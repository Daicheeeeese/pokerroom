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
        console.error(`Invalid date format: ${date}`, error)
        return null
      }
    }).filter((date): date is Date => date !== null)

    if (dates.length === 0) {
      return NextResponse.json(
        { error: 'No valid dates provided' },
        { status: 400 }
      )
    }

    console.log('Fetching availability for room:', params.id)
    console.log('Dates:', dates.map(d => d.toISOString()))

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

    console.log('Found availabilities:', availabilities)

    // データが見つからない場合は、すべての日付を利用可能として返す
    if (availabilities.length === 0) {
      console.log('No availabilities found, returning all dates as available')
      return NextResponse.json(
        dates.map(date => ({
          date: date.toISOString(),
          isAvailable: true
        }))
      )
    }

    // 予約可能状態をマップ
    const availabilityMap = new Map(
      availabilities.map(a => [
        a.date.toISOString().split('T')[0],
        a.isAvailable
      ])
    )

    // すべての日付に対して予約可能状態を返す
    const response = dates.map(date => ({
      date: date.toISOString(),
      isAvailable: availabilityMap.get(date.toISOString().split('T')[0]) ?? true
    }))

    console.log('Final response:', response)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching room availability:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 