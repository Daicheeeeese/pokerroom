import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("認証が必要です", { status: 401 })
    }

    const body = await request.json()
    const { roomId, date, startTime, endTime, totalPrice } = body

    // バリデーション
    if (!roomId || !date || !startTime || !endTime || !totalPrice) {
      return new NextResponse("必須項目が不足しています", { status: 400 })
    }

    // 予約の作成
    const reservation = await prisma.reservation.create({
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
    console.error(error)
    return new NextResponse("予約の作成に失敗しました", { status: 500 })
  }
} 