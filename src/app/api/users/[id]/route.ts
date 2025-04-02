import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    // 自分の情報のみ取得可能
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "ユーザー情報の取得に失敗しました" },
      { status: 500 }
    )
  }
} 