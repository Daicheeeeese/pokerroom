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
        options: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        nearestStations: true,
        businessHours: true
      },
    })

    if (!room) {
      return NextResponse.json(
        { error: "ルームが見つかりません" },
        { status: 404 }
      )
    }

    // optionsをフラット化
    const flattenedRoom = {
      ...room,
      options: room.options.map(opt => ({
        id: opt.id,
        name: opt.name,
        price: opt.price,
        unit: opt.unit,
        isRequired: opt.isRequired,
      })),
      // hourlyPricesWeekdayがnullの場合は空配列を返す    }

    return NextResponse.json(flattenedRoom)
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json(
      { error: "ルームの取得に失敗しました" },
      { status: 500 }
    )
  }
}