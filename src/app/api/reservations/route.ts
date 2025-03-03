import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// バリデーションスキーマ
const reservationSchema = z.object({
  roomId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  totalPrice: z.number(),
})

export async function POST(request: NextRequest) {
  try {
    console.log("予約リクエスト開始")
    const session = await getServerSession(authOptions)
    console.log("セッション:", session)
    
    if (!session?.user?.id) {
      console.log("認証エラー: セッションまたはユーザーIDが存在しません")
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("リクエストボディ:", body)
    
    // リクエストボディのバリデーション
    const result = reservationSchema.safeParse(body)
    if (!result.success) {
      console.log("バリデーションエラー:", result.error)
      return NextResponse.json(
        { error: "無効なリクエストデータです", details: result.error },
        { status: 400 }
      )
    }

    const { roomId, date, startTime, endTime, totalPrice } = result.data
    console.log("パースされたデータ:", { roomId, date, startTime, endTime, totalPrice })

    // 日付のバリデーション
    const reservationDate = new Date(date)
    if (isNaN(reservationDate.getTime())) {
      console.log("無効な日付:", date)
      return NextResponse.json(
        { error: "無効な日付です" },
        { status: 400 }
      )
    }

    // 時間のバリデーション
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      console.log("無効な時間形式:", { startTime, endTime })
      return NextResponse.json(
        { error: "無効な時間形式です" },
        { status: 400 }
      )
    }

    // ルームの存在確認
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    })
    console.log("ルーム検索結果:", room)

    if (!room) {
      console.log("ルームが見つかりません:", roomId)
      return NextResponse.json(
        { error: "指定されたルームが見つかりません" },
        { status: 404 }
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
    console.log("重複予約チェック結果:", existingReservation)

    if (existingReservation) {
      console.log("重複する予約が見つかりました")
      return NextResponse.json(
        { error: "指定の時間帯は既に予約されています" },
        { status: 409 }
      )
    }

    // 予約の作成
    console.log("予約作成開始:", {
      roomId,
      userId: session.user.id,
      date: reservationDate,
      startTime,
      endTime,
      totalPrice,
    })
    
    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        userId: session.user.id,
        date: reservationDate,
        startTime,
        endTime,
        totalPrice,
      },
      include: {
        room: true
      }
    })
    console.log("予約作成成功:", reservation)

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("予約作成エラー:", error)
    return NextResponse.json(
      { error: "予約の作成に失敗しました", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("予約一覧取得開始")
    const session = await getServerSession(authOptions)
    console.log("セッション:", session)
    
    if (!session?.user?.id) {
      console.log("認証エラー: セッションまたはユーザーIDが存在しません")
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
    console.log("予約一覧取得成功:", reservations)

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("予約取得エラー:", error)
    return NextResponse.json(
      { error: "予約の取得に失敗しました", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 