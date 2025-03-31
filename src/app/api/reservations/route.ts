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
    console.log("予約APIが呼び出されました")
    
    const session = await getServerSession(authOptions)
    console.log("セッション情報の詳細:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name,
      rawSession: session
    })

    if (!session?.user?.id) {
      console.error("ユーザー認証エラー: セッションまたはユーザーIDが存在しません")
      return corsResponse(
        { error: "認証が必要です" },
        401
      )
    }

    // ユーザーの存在確認
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.user.id },
          { email: session.user.email }
        ]
      }
    })
    console.log("データベースのユーザー情報:", user)

    if (!user) {
      console.error("ユーザーが見つかりません。セッション情報:", {
        userId: session.user.id,
        email: session.user.email
      })
      
      // ユーザーを作成
      try {
        const defaultPassword = "temporary_" + Math.random().toString(36).slice(2)
        const newUser = await prisma.user.create({
          data: {
            id: session.user.id,
            email: session.user.email || `${session.user.id}@example.com`,
            name: session.user.name || "",
            password: defaultPassword
          }
        })
        console.log("新しいユーザーを作成しました:", newUser)
        user = newUser // 作成したユーザーを設定
      } catch (createError) {
        console.error("ユーザー作成エラー:", createError)
        if (createError instanceof Error) {
          console.error("エラーの詳細:", {
            message: createError.message,
            stack: createError.stack,
            name: createError.name
          })
          // 既存のユーザーを使用
          const existingUser = await prisma.user.findUnique({
            where: {
              email: session.user.email
            }
          })
          if (existingUser) {
            console.log("既存のユーザーを使用します:", existingUser)
            user = existingUser // 既存のユーザーを設定
          } else {
            return corsResponse(
              { error: "ユーザーの作成に失敗しました" },
              500
            )
          }
        }
      }
    }

    const data = await request.json()
    console.log("リクエストデータ:", JSON.stringify(data, null, 2))

    // この時点でユーザーが存在しない場合は早期リターン
    if (!user) {
      console.error("ユーザーが見つかりません")
      return corsResponse(
        { error: "ユーザーが見つかりません" },
        404
      )
    }

    // バリデーション
    if (!data.roomId || !data.date || !data.startTime || !data.endTime || !data.totalPrice) {
      console.error("バリデーションエラー: 必須フィールドが不足しています")
      return corsResponse(
        { error: "必須フィールドが不足しています" },
        400
      )
    }

    // 部屋の存在確認
    const room = await prisma.room.findUnique({
      where: {
        id: data.roomId
      }
    })

    if (!room) {
      console.error("部屋が見つかりません。部屋ID:", data.roomId)
      return corsResponse(
        { error: "指定された部屋が見つかりません" },
        404
      )
    }

    // 日付のバリデーション
    const reservationDate = new Date(data.date)
    if (isNaN(reservationDate.getTime())) {
      console.error("日付バリデーションエラー: 無効な日付形式です")
      return corsResponse(
        { error: "無効な日付形式です" },
        400
      )
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
          status: ReservationStatus.PENDING
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

      return corsResponse({
        message: "予約が作成されました",
        reservation
      }, 201)
    } catch (dbError) {
      console.error("データベースエラー:", dbError)
      if (dbError instanceof Error) {
        console.error("エラーの詳細:", {
          message: dbError.message,
          stack: dbError.stack,
          name: dbError.name
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
    console.error("予約作成中にエラーが発生:", error)
    if (error instanceof Error) {
      console.error("エラーの詳細:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return corsResponse(
      { error: "予約の作成中にエラーが発生しました" },
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
            image: true
          }
        }
      },
      orderBy: {
        date: 'desc'
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