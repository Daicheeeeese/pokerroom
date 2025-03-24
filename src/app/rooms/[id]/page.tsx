import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import RoomDetailSection from '@/components/rooms/RoomDetailSection'
import ImageGallery from '@/components/rooms/ImageGallery'
import { notFound } from 'next/navigation'
import { RoomTags } from '@/components/rooms/RoomTags'
import type { Room, Review, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Tag } from '@prisma/client'

type RoomWithDetails = Room & {
  reviews: Review[]
  hourlyPrices: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  images: RoomImage[]
  tags: Tag[]
  pricePerHour: number | null
}

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      reviews: true,
      hourlyPrices: true,
      hourlyPricesHoliday: true,
      images: {
        orderBy: {
          order: 'asc'
        }
      },
      tags: true
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
}

export default async function RoomPage({ params }: Props) {
  const { id } = params
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: params.id,
      },
      include: {
        reviews: true,
        hourlyPrices: true,
        hourlyPricesHoliday: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        tags: true,
      }
    })

    if (!room) {
      notFound()
    }

    const roomWithDetails = room as RoomWithDetails

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ImageGallery mainImage={roomWithDetails.image || ''} images={roomWithDetails.images} />
          <div className="mt-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{roomWithDetails.name}</h1>
                <p className="mt-2 text-gray-500 text-sm md:text-base">{roomWithDetails.description || ''}</p>
              </div>
            </div>
            <div className="mt-4">
              <RoomTags tags={roomWithDetails.tags} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RoomDetailSection room={roomWithDetails} />
            </div>
            <div className="lg:col-span-1">
              {/* 予約フォームやその他の情報をここに配置 */}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching room details:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            データの取得中にエラーが発生しました。しばらく時間をおいて再度お試しください。
          </div>
        </div>
      </div>
    )
  }
} 