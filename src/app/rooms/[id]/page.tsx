import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import RoomDetailSection from '@/components/rooms/RoomDetailSection'
import ReservationForm from '@/components/ReservationForm'
import { notFound } from 'next/navigation'

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
      hourlyPrices: true
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
    where: { id },
    include: {
      reviews: true,
      hourlyPrices: true
    }
  })

  if (!room) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RoomDetailSection room={room} />
        </div>
        <div className="lg:col-span-1">
          <ReservationForm room={room} />
        </div>
      </div>
    </div>
  )
} 