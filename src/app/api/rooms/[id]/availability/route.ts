import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// このルートを動的に設定
export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const roomId = params.id
    const url = new URL(req.url)
    const dateStrings = url.searchParams.get("dates")?.split(",") || []

    // 日付のバリデーション
    const dates = dateStrings
      .map((d) => {
        try {
          const date = new Date(d)
          date.setUTCHours(0, 0, 0, 0) // 時刻を0に設定
          return date
        } catch (error) {
          console.error(`Invalid date format: ${d}`, error)
          return null
        }
      })
      .filter((date): date is Date => date !== null)

    if (dates.length === 0) {
      return NextResponse.json(
        { error: 'No valid dates provided' },
        { status: 400 }
      )
    }

    const availability = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        date: {
          in: dates,
        },
      },
      select: {
        date: true,
        isAvailable: true
      }
    })

    // データが見つからない場合は、すべての日付を利用可能として返す
    if (availability.length === 0) {
      return NextResponse.json(
        dates.map(date => ({
          date: date.toISOString(),
          isAvailable: true
        }))
      )
    }

    // 予約可能状態をマップ
    const availabilityMap = new Map(
      availability.map(a => [
        a.date.toISOString().split('T')[0],
        a.isAvailable
      ])
    )

    // すべての日付に対して予約可能状態を返す
    const response = dates.map(date => ({
      date: date.toISOString(),
      isAvailable: availabilityMap.get(date.toISOString().split('T')[0]) ?? true
    }))

    return NextResponse.json(response)
  } catch (err) {
    console.error("🔥 API error:", err)
    if (err instanceof Error) {
      console.error('Detailed error information:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        cause: err.cause
      })
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 