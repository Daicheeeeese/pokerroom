import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { reservationCode, email } = await request.json()

    const reservation = await prisma.reservation.findFirst({
      where: {
        reservationCode,
        guestEmail: email,
      },
      include: {
        room: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: '予約が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json(
      { error: '予約の確認に失敗しました' },
      { status: 500 }
    )
  }
} 