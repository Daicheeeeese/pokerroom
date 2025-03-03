import { prisma } from "@/lib/prisma"
import RoomList from "@/components/rooms/RoomList"

export const dynamic = "force-dynamic"

export default async function RoomsPage() {
  try {
    console.log("Fetching rooms...") // デバッグ用ログ

    const rooms = await prisma.room.findMany({
      include: {
        reviews: true,
      },
    })

    console.log("Found rooms:", JSON.stringify(rooms, null, 2)) // デバッグ用ログ

    if (!rooms || rooms.length === 0) {
      console.log("No rooms found") // デバッグ用ログ
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">ポーカールーム一覧</h1>
          <p>現在、利用可能なルームはありません。</p>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ポーカールーム一覧</h1>
        <RoomList rooms={rooms} />
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