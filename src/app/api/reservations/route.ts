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
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { roomId, date, startTime, endTime, people, options, totalPrice } = body

    if (!roomId || !date || !startTime || !endTime || !people || !totalPrice) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        roomId,
        userId: user.id,
        date: new Date(date),
        startTime,
        endTime,
        people: parseInt(people),
        totalPrice,
        status: 'PENDING',
        options: {
          create: options.map((option: { optionId: string, quantity: number }) => ({
            optionId: option.optionId,
            quantity: option.quantity,
          })),
        },
      },
      include: {
        options: {
          include: {
            option: true,
          },
        },
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: '予約の作成に失敗しました' },
      { status: 500 }
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