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

    const orderBy: Prisma.RoomOrderByWithRelationInput = {
      baseprice: sort === 'price_desc' ? 'desc' : 'asc',
    }

    const rooms = await prisma.room.findMany({
      orderBy,
      skip: (currentPage - 1) * roomsPerPage,
      take: roomsPerPage,
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        nearestStations: true,
      },
    }) as RoomWithReviews[]

    // 総件数（ページネーション用）
    const totalCount = await prisma.room.count()
    const totalPages = Math.ceil(totalCount / roomsPerPage)

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