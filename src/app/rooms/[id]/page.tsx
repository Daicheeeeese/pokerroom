import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import RoomDetailSection from '@/components/rooms/RoomDetailSection'
import ImageGallery from '@/components/rooms/ImageGallery'
import { notFound } from 'next/navigation'
import { RoomTags } from '@/components/rooms/RoomTags'

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
      images: true
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
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: true,
      hourlyPrices: true,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageGallery mainImage={room.image || ''} images={room.images} />
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
        <p className="mt-4 text-gray-500">{room.description || ''}</p>
        <div className="mt-4">
          <RoomTags tags={room.tags} />
        </div>
      </div>
      <div className="w-full">
        <RoomDetailSection room={room} />
      </div>
    </div>
  )
} 