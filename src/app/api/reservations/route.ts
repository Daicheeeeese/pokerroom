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
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }

    const body = await request.json()
    const { roomId, date, startTime, endTime, people, options, totalPrice } = body

    if (!roomId || !date || !startTime || !endTime || !people || !totalPrice) {
      return NextResponse.json(
        { error: '必要な情報が不足しています', details: { roomId, date, startTime, endTime, people, totalPrice } },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
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

    // ルーム情報を取得
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    })

    if (!room) {
      return NextResponse.json(
        { error: 'ルームが見つかりません' },
        { status: 404 }
      )
    }

    // メール送信
    try {
      await sendReservationConfirmationEmail({
        userEmail: user.email,
        userName: user.name || 'ゲスト',
        roomName: room.name,
        date,
        startTime,
        endTime,
        totalPrice,
      })
    } catch (error) {
      console.error('メール送信エラー:', error)
      // メール送信エラーは予約プロセスを中断しない
    }

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

    if (!session?.user?.email) {
      return corsResponse(
        { error: "認証が必要です" },
        401
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return corsResponse(
        { error: "ユーザーが見つかりません" },
        404
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as ReservationStatus | null

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

    return corsResponse({ reservations })
  } catch (error) {
    console.error("予約取得エラー:", error)
    return corsResponse(
      { error: "予約の取得中にエラーが発生しました" },
      500
    )
  }
} 