import { dbsql } from "@/lib/db"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import RoomDetailSection from "@/components/rooms/RoomDetailSection"

export type Room = {
  id: string
  name: string
  description: string
  image: string
  capacity: number
  pricePerHour: number
  createdAt: Date
  updatedAt: Date
  average_rating: string
  review_count: number
}

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { rows: [room] } = await dbsql`
    SELECT *
    FROM "Room"
    WHERE id = ${id}
  `

  if (!room) {
    return {
      title: "ルームが見つかりません",
    }
  }

  return {
    title: `${room.name} | ポーカールーム`,
  }
}

export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params
  const { rows: [roomData] } = await dbsql`
    SELECT 
      r.*,
      COALESCE(AVG(rev.rating), 0) as average_rating,
      COUNT(rev.id) as review_count
    FROM "Room" r
    LEFT JOIN "Review" rev ON r.id = rev."roomId"
    WHERE r.id = ${id}
    GROUP BY r.id
  `

  if (!roomData) {
    notFound()
  }

  const room: Room = {
    id: roomData.id,
    name: roomData.name,
    description: roomData.description,
    image: roomData.image,
    capacity: roomData.capacity,
    pricePerHour: roomData.pricePerHour,
    createdAt: new Date(roomData.createdAt),
    updatedAt: new Date(roomData.updatedAt),
    average_rating: roomData.average_rating,
    review_count: roomData.review_count,
  }

  const { rows: reviews } = await dbsql`
    SELECT 
      rev.*,
      rev."createdAt" as created_at
    FROM "Review" rev
    WHERE rev."roomId" = ${id}
    ORDER BY rev."createdAt" DESC
  `

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative h-96 mb-4">
          <Image
            src={room.image}
            alt={room.name}
            fill
            priority
            className="object-cover rounded-lg"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
        <p className="text-gray-600 mb-4">{room.description}</p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-400 mr-1">★</span>
          <span>{parseFloat(room.average_rating).toFixed(1)}</span>
          <span className="text-gray-600 ml-1">({room.review_count}件のレビュー)</span>
        </div>
      </div>

      <RoomDetailSection room={room} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">レビュー</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{review.rating}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-gray-400 text-sm mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">まだレビューはありません。</p>
        )}
      </div>
    </div>
  )
} 