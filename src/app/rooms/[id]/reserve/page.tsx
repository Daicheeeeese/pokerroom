import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReservationForm } from "@/components/rooms/ReservationForm"

type Props = {
  params: {
    id: string
  }
}

export default async function ReservePage({ params }: Props) {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      images: {
        orderBy: {
          order: 'asc'
        }
      },
      nearestStations: true,
      reviews: true
    }
  })

  if (!room) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">予約</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
            <p className="text-gray-600">¥{room.pricePerHour.toLocaleString()}/時間 · 最大{room.capacity}人</p>
          </div>
          <ReservationForm room={room} />
        </div>
      </div>
    </div>
  )
} 