import Image from "next/image"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from "@/lib/prisma"
import { ReservationForm } from "@/components/rooms/ReservationForm"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!room) {
    return {
      title: "ルームが見つかりません",
    }
  }

  return {
    title: room.name,
    description: room.description,
  }
}

export default async function RoomDetailPage({ params }: Props) {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: true,
    },
  })

  if (!room) {
    notFound()
  }

  const averageRating =
    room.reviews.length > 0
      ? room.reviews.reduce((acc, review) => acc + review.rating, 0) /
        room.reviews.length
      : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 mb-6">
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
          <p className="text-gray-600 mb-4">{room.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">基本情報</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">エリア:</span> {room.area}
              </p>
              <p>
                <span className="font-medium">住所:</span> {room.address}
              </p>
              <p>
                <span className="font-medium">料金:</span>{" "}
                ¥{room.price.toLocaleString()}/時間
              </p>
              <p>
                <span className="font-medium">定員:</span> {room.capacity}人
              </p>
              {averageRating && (
                <p className="flex items-center">
                  <span className="font-medium mr-2">評価:</span>
                  <span className="text-yellow-400">★</span>
                  <span>{averageRating.toFixed(1)}</span>
                </p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">設備・アメニティ</h2>
            <div className="flex flex-wrap gap-2">
              {room.facilities.map((facility) => (
                <span
                  key={facility}
                  className="bg-white px-3 py-1 rounded-full text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-2xl font-bold mb-6">予約</h2>
            <ReservationForm room={room} />
          </div>
        </div>
      </div>
    </div>
  )
} 