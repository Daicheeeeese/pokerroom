import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addDays, format } from 'date-fns'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const roomId = params.id
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 2週間分の日付を生成
    const dates = Array.from({ length: 14 }, (_, i) => {
      return addDays(today, i)
    })

    // 各日付の空き状況を取得
    const availabilityData = await Promise.all(
      dates.map(async (date) => {
        // すべての日付を予約可能にする
        return {
          date: format(date, 'yyyy-MM-dd'),
          isAvailable: true
        }
      })
    )

    return NextResponse.json(availabilityData)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability data' },
      { status: 500 }
    )
  }
} 