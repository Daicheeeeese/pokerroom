import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbsql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
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
    const { roomId, date, startTime, endTime, totalPrice } = body

    // ユーザーの存在確認
    const { rows: [user] } = await dbsql`
      SELECT id FROM "User" WHERE id = ${session.user.id}
    `
    console.log("ユーザー検索結果:", user)

    if (!user) {
      console.log("ユーザーが見つかりません:", session.user.id)
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // 予約の重複チェック
    const { rows: existingReservations } = await dbsql`
      SELECT *
      FROM "Reservation"
      WHERE "roomId" = ${roomId}
      AND "date" = ${date}
      AND (
        (${startTime} >= "startTime" AND ${startTime} < "endTime")
        OR (${endTime} > "startTime" AND ${endTime} <= "endTime")
        OR (${startTime} <= "startTime" AND ${endTime} >= "endTime")
      )
    `
    console.log("重複予約チェック結果:", existingReservations)

    if (existingReservations.length > 0) {
      console.log("重複する予約が見つかりました")
      return NextResponse.json(
        { error: "この時間帯は既に予約が入っています" },
        { status: 400 }
      )
    }

    // 予約の作成
    console.log("予約作成開始:", {
      roomId,
      userId: session.user.id,
      date,
      startTime,
      endTime,
      totalPrice,
    })
    
    const { rows: [reservation] } = await dbsql`
      INSERT INTO "Reservation" (
        "userId",
        "roomId",
        "date",
        "startTime",
        "endTime",
        "totalPrice"
      )
      VALUES (
        ${session.user.id},
        ${roomId},
        ${date},
        ${startTime},
        ${endTime},
        ${totalPrice}
      )
      RETURNING *
    `
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

export async function GET() {
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

    const { rows: reservations } = await dbsql`
      SELECT 
        r.*,
        rm.name as "roomName",
        rm.image as "roomImage"
      FROM "Reservation" r
      JOIN "Room" rm ON r."roomId" = rm.id
      WHERE r."userId" = ${session.user.id}
      ORDER BY r."date" DESC
    `
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