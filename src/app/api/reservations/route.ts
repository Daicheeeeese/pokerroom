import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
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

    // 予約の作成
    const reservation = await prisma.Reservation.create({
      data: {
        roomId,
        userId: session.user.id,
        date: new Date(date),
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