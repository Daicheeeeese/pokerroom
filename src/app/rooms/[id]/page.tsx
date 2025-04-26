import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { RoomDetailSection } from '@/components/rooms/RoomDetailSection'
import ImageGallery from '@/components/rooms/ImageGallery'
import { notFound } from 'next/navigation'
import type { Prisma } from '@prisma/client'

type RoomWithDetails = Prisma.RoomGetPayload<{
  include: {
    reviews: true;
    images: true;
    hourlyPricesWeekday: true;
    hourlyPricesHoliday: true;
    nearestStations: true;
    businessHours: true;
    options: true;
  };
}> & {
  nextAvailableDate: Date | null;
}

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!room) {
      return {
        title: 'ルームが見つかりません',
        description: '指定されたルームは存在しません。'
      }
    }

    return {
      title: `${room.name} | PokerRoom`,
      description: room.description || `${room.name}の詳細ページです。`
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'エラーが発生しました',
      description: 'データの取得中にエラーが発生しました。'
    }
  }
}

export async function generateStaticParams() {
  try {
    const rooms = await prisma.room.findMany({
      select: { id: true }
    })
    return rooms.map((room) => ({ id: room.id }))
  } catch (error) {
    console.error("Error in generateStaticParams:", error)
    return []
  }
}

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string }
}) {
  console.log('RoomDetailPage: Fetching room with ID:', params.id)

  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        hourlyPricesWeekday: true,
        hourlyPricesHoliday: true,
        options: {
          select: {
            id: true,
            option: true,
            price: true,
            unit: true,
            isRequired: true,
          }
        },
        businessHours: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        reviews: true,
        nearestStations: true,
      },
    })

    console.log('RoomDetailPage: Room found:', room ? 'Yes' : 'No')

    if (!room) {
      console.log('RoomDetailPage: Room not found, redirecting to 404')
      notFound()
    }

    return <RoomDetailSection room={room} />
  } catch (error) {
    console.error("Error in RoomDetailPage:", error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }

    throw new Error(`ルームの取得に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 