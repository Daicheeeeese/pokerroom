import { prisma } from "@/lib/prisma"
import RoomList from "@/components/rooms/RoomList"
import SearchFilters from "@/components/rooms/SearchFilters"

export const dynamic = "force-dynamic"

export default async function SearchPage() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        reviews: true,
      },
    })

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ポーカールーム検索</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* フィルター */}
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>

          {/* 検索結果 */}
          <div className="lg:col-span-3">
            <RoomList rooms={rooms} />
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    })
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">エラーが発生しました</h1>
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