import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// このルートを動的に設定
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== API Request Start ===')
    console.log('Request URL:', request.url)
    console.log('Room ID:', params.id)

    const { searchParams } = new URL(request.url)
    const datesParam = searchParams.get('dates')
    console.log('Raw dates parameter:', datesParam)
    
    if (!datesParam) {
      console.log('Error: Dates parameter is missing')
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

    console.log('Parsed dates:', dates.map(d => ({
      original: d.toISOString(),
      dateOnly: d.toISOString().split('T')[0]
    })))

    if (dates.length === 0) {
      console.log('Error: No valid dates after parsing')
      return NextResponse.json(
        { error: 'No valid dates provided' },
        { status: 400 }
      )
    }

    console.log('Executing Prisma query with parameters:')
    console.log('Room ID:', params.id)
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
        isBooked: true
      }
    })

    console.log('Database query result:', {
      found: availabilities.length,
      records: availabilities.map(a => ({
        date: a.date.toISOString(),
        isBooked: a.isBooked
      }))
    })

    // データが見つからない場合は、すべての日付を利用可能として返す
    if (availabilities.length === 0) {
      console.log('No records found in database, returning default availabilities')
      const defaultResponse = dates.map(date => ({
        date: date.toISOString(),
        isAvailable: true
      }))
      console.log('Default response:', defaultResponse)
      return NextResponse.json(defaultResponse)
    }

    // 予約可能状態をマップ（isBookedの値を反転させてisAvailableとして返す）
    const availabilityMap = new Map(
      availabilities.map(a => [
        a.date.toISOString().split('T')[0],
        !a.isBooked // isBookedの値を反転
      ])
    )
    console.log('Availability map:', Object.fromEntries(availabilityMap))

    // すべての日付に対して予約可能状態を返す
    const response = dates.map(date => {
      const dateKey = date.toISOString().split('T')[0]
      const isAvailable = availabilityMap.get(dateKey) ?? true
      console.log(`Mapping date ${dateKey}: isAvailable = ${isAvailable}`)
      return {
        date: date.toISOString(),
        isAvailable
      }
    })

    console.log('=== Final Response ===')
    console.log(JSON.stringify(response, null, 2))
    console.log('=== API Request End ===')
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('=== Error in API ===')
    console.error('Error fetching room availability:', error)
    if (error instanceof Error) {
      console.error('Detailed error information:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
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