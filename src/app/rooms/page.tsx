import { prisma } from "@/lib/prisma"
import RoomCard from '@/components/rooms/RoomCard'
import Link from "next/link"
import type { Room, Review } from '@prisma/client'
import Image from "next/image"

export const dynamic = "force-dynamic"

type RoomWithReviews = Room & {
  reviews: Review[]
}

export default async function RoomsPage() {
  try {
    // ルーム一覧を取得（サーバーサイドで直接Prismaを使用）
    const rooms = await prisma.room.findMany({
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      },
    })

    console.log('Fetched rooms:', JSON.stringify(rooms, null, 2))

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ポーカールーム一覧</h1>
          <Link
            href="/rooms/search"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            日付で検索
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: RoomWithReviews) => (
            <RoomCard key={room.id} room={room} selectedDate={null} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error details:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-red-600">エラーが発生しました</h1>
        <p className="text-gray-600 mb-4">ルーム情報の取得中にエラーが発生しました。</p>
        {process.env.NODE_ENV === "development" && (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>
    )
  }
} 