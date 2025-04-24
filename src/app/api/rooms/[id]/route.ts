import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        hourlyPricesWeekday: true,
        hourlyPricesHoliday: true,
        options: {
          include: {
            option: true
          }
        }
      },
    })

    if (!room) {
      return NextResponse.json(
        { error: "ルームが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json(
      { error: "ルームの取得に失敗しました" },
      { status: 500 }
    )
  }
} 