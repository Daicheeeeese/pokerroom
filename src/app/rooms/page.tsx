import { prisma } from "@/lib/prisma"
import RoomCard from '@/components/rooms/RoomCard'
import Link from "next/link"
import type { Room, Review, Prisma } from '@prisma/client'
import Image from "next/image"
import SortSelect from '@/components/rooms/SortSelect'

export const dynamic = "force-dynamic"

type RoomWithReviews = Room & {
  reviews: Review[]
  images: {
    id: string
    url: string
    order: number
    createdAt: Date
    updatedAt: Date
    roomId: string
  }[]
  nearestStations: {
    id: string
    name: string
    transport: string
    minutes: number
    createdAt: Date
    updatedAt: Date
    roomId: string
  }[]
  unit: string
}

type SortType = 'price_asc' | 'price_desc'

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: { sort?: SortType; page?: string }
}) {
  try {
    const sort = searchParams.sort || 'price_asc'
    const currentPage = Number(searchParams.page) || 1
    const roomsPerPage = 6

    // 全ルームを取得（サーバーサイドで直接Prismaを使用）
    const allRooms = await prisma.room.findMany({
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        nearestStations: true
      }
    }) as RoomWithReviews[]

    console.log('取得した全ルーム数:', allRooms.length)

    // 全ルームを価格で並び替え
    const sortedRooms = [...allRooms].sort((a, b) => {
      if (sort === 'price_asc') {
        // 価格が安い順
        return a.baseprice - b.baseprice
      } else {
        // 価格が高い順
        return b.baseprice - a.baseprice
      }
    })

    // ページネーション用の計算
    const totalPages = Math.ceil(sortedRooms.length / roomsPerPage)
    const startIndex = (currentPage - 1) * roomsPerPage
    const endIndex = startIndex + roomsPerPage

    // 現在のページのルームを取得
    const rooms = sortedRooms.slice(startIndex, endIndex)

    console.log('現在のページ:', currentPage)
    console.log('総ページ数:', totalPages)
    console.log('表示するルーム:', rooms.map(room => ({
      id: room.id,
      name: room.name,
      baseprice: room.baseprice
    })))

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ポーカールーム一覧</h1>
          <div className="flex items-center gap-4">
            <SortSelect />
            <Link
              href="/rooms/search"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              利用日で検索
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room: RoomWithReviews) => (
            <RoomCard key={room.id} room={room} selectedDate={null} />
          ))}
        </div>

        {/* ページネーション */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/rooms?sort=${sort}&page=${page}`}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </Link>
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