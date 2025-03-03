import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const { roomId, date, startTime, endTime, totalPrice } = await request.json()

    // バリデーション
    if (!roomId || !date || !startTime || !endTime || !totalPrice) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      )
    }

    // 日付のバリデーション
    const reservationDate = new Date(date)
    if (isNaN(reservationDate.getTime())) {
      return NextResponse.json(
        { error: "無効な日付です" },
        { status: 400 }
      )
    }

    // 予約の重複チェック
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        roomId,
        date: reservationDate,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    })

    if (existingReservation) {
      return NextResponse.json(
        { error: "指定の時間帯は既に予約されています" },
        { status: 409 }
      )
    }

    // 予約の作成
    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        userId: session.user.id,
        date: reservationDate,
        startTime,
        endTime,
        totalPrice,
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("予約作成エラー:", error)
    return NextResponse.json(
      { error: "予約の作成に失敗しました" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        room: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("予約取得エラー:", error)
    return NextResponse.json(
      { error: "予約の取得に失敗しました" },
      { status: 500 }
    )
  }
} 