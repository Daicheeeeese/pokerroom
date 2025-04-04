import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendReservationConfirmationEmail } from "@/lib/mail"
import { ReservationStatus } from "@prisma/client"

export const dynamic = 'force-dynamic'

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data = {
      roomId: formData.get('roomId') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      totalPrice: parseInt(formData.get('totalPrice') as string),
    }
    
    console.log("予約リクエストデータ:", JSON.stringify(data, null, 2))
    
    const session = await getServerSession(authOptions)
    console.log("セッション情報:", JSON.stringify(session, null, 2))

    if (!session?.user?.id) {
      return corsResponse({ error: "認証が必要です" }, 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    console.log("ユーザー情報:", JSON.stringify(user, null, 2))

    if (!user) {
      return corsResponse({ error: "ユーザーが見つかりません" }, 404)
    }

    // 日付の検証
    const reservationDate = new Date(data.date)
    if (isNaN(reservationDate.getTime())) {
      return corsResponse({ error: "無効な日付です" }, 400)
    }

    // 予約の作成
    try {
      console.log("予約作成開始:", {
        userId: user.id,
        roomId: data.roomId,
        date: reservationDate,
        startTime: data.startTime,
        endTime: data.endTime,
        totalPrice: data.totalPrice
      })

      const reservation = await prisma.reservation.create({
        data: {
          roomId: data.roomId,
          userId: user.id,
          date: reservationDate,
          startTime: data.startTime,
          endTime: data.endTime,
          totalPrice: data.totalPrice,
          status: ReservationStatus.PENDING,
        },
        include: {
          room: true,
          user: true,
        },
      })

      console.log("予約が作成されました:", JSON.stringify(reservation, null, 2))

      // 確認メールの送信
      await sendReservationConfirmationEmail({
        userEmail: reservation.user.email!,
        userName: reservation.user.name!,
        roomName: reservation.room.name,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        totalPrice: reservation.totalPrice,
      })

      return NextResponse.redirect(new URL(`/reservations/${reservation.id}`, request.url))
    } catch (dbError) {
      console.error("データベースエラー:", dbError)
      if (dbError instanceof Error) {
        console.error("エラーの詳細:", {
          message: dbError.message,
          stack: dbError.stack,
          name: dbError.name,
          cause: dbError.cause
        })
        return corsResponse(
          { error: `データベースエラー: ${dbError.message}` },
          500
        )
      }
      return corsResponse(
        { error: "データベースエラーが発生しました" },
        500
      )
    }
  } catch (error) {
    console.error("予約エラー:", error)
    if (error instanceof Error) {
      console.error("エラーの詳細:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      })
    }
    return corsResponse(
      { error: "予約の作成に失敗しました" },
      500
    )
  }
}

export async function GET(request: Request) {
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
      return corsResponse(
        { error: "認証が必要です" },
        401
      )
    }

    // データベースから正しいユーザーIDを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log("API - エラー: ユーザーが見つかりません")
      return corsResponse(
        { error: "ユーザーが見つかりません" },
        404
      )
    }

    console.log("API - データベースのユーザー情報:", {
      id: user.id,
      email: user.email,
      name: user.name
    })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ReservationStatus | null

    // 予約の取得
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
        ...(status ? { status } : {})
      },
      include: {
        room: {
          select: {
            name: true,
            images: {
              orderBy: {
                order: 'asc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log("API - 取得した予約データ:", {
      count: reservations.length,
      reservations: reservations.map(r => ({
        id: r.id,
        date: r.date,
        status: r.status,
        roomName: r.room.name
      }))
    })

    return corsResponse({ reservations })
  } catch (error) {
    console.error("予約取得エラー:", error)
    return corsResponse(
      { error: "予約の取得中にエラーが発生しました" },
      500
    )
  }
} 