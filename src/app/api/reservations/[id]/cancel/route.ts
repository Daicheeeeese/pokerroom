import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCancellationEmail } from '@/lib/mail'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.update({
      where: {
        id: params.id,
      },
      data: {
        status: 'CANCELLED',
      },
      include: {
        user: true,
      },
    })

    // キャンセル通知メールの送信
    await sendCancellationEmail({
      email: reservation.guestEmail || reservation.user?.email,
      name: reservation.guestName || reservation.user?.name,
      reservationCode: reservation.reservationCode,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
    })

    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json(
      { error: '予約のキャンセルに失敗しました' },
      { status: 500 }
    )
  }
} 