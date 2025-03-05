import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    console.log("API - セッション情報:", {
      authenticated: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      } : null
    })

    if (!session?.user?.id) {
      console.log("API - 認証エラー: ユーザーIDが見つかりません")
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // データベースから正しいユーザーIDを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log("API - エラー: ユーザーが見つかりません")
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 })
    }

    // 予約の存在確認と権限チェック
    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id }
    })

    if (!reservation) {
      console.log("API - エラー: 予約が見つかりません")
      return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 })
    }

    if (reservation.userId !== user.id) {
      console.log("API - エラー: この予約をキャンセルする権限がありません")
      return NextResponse.json({ error: "この予約をキャンセルする権限がありません" }, { status: 403 })
    }

    // 予約をキャンセル
    await prisma.reservation.delete({
      where: { id: params.id }
    })

    console.log("API - 予約をキャンセルしました:", {
      reservationId: params.id,
      userId: user.id
    })

    return NextResponse.json({ message: "予約をキャンセルしました" })
  } catch (error) {
    console.error("API - エラー:", error)
    return NextResponse.json({ error: "予約のキャンセルに失敗しました" }, { status: 500 })
  }
} 