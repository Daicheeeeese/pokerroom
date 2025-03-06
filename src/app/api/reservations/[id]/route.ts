import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// CORSヘッダーを設定する関数
function corsResponse(data: any, status: number = 200) {
  const origin = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3010'

  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

// OPTIONSリクエストのハンドラー
export async function OPTIONS() {
  return corsResponse({}, 200)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return corsResponse(
        { error: "認証が必要です" },
        401
      )
    }

    const reservationId = params.id
    if (!reservationId) {
      return corsResponse(
        { error: "予約IDが必要です" },
        400
      )
    }

    // 予約の存在確認と所有者チェック
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { user: true }
    })

    if (!reservation) {
      return corsResponse(
        { error: "予約が見つかりません" },
        404
      )
    }

    if (reservation.userId !== session.user.id) {
      return corsResponse(
        { error: "この予約をキャンセルする権限がありません" },
        403
      )
    }

    // 予約のステータスを更新
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: "CANCELLED" }
    })

    return corsResponse({
      message: "予約をキャンセルしました",
      reservation: updatedReservation
    })
  } catch (error) {
    console.error("予約キャンセルエラー:", error)
    return corsResponse(
      { error: "予約のキャンセル中にエラーが発生しました" },
      500
    )
  }
} 