import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"

export default async function RoomsPage() {
  console.log("Fetching rooms") // デバッグ用ログ

  const rooms = await prisma.room.findMany({
    include: {
      reviews: true,
    },
  })

  console.log("Found rooms:", rooms) // デバッグ用ログ

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ポーカールーム一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          console.log("Room ID:", room.id) // デバッグ用ログ
          const averageRating = room.reviews.length > 0
            ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
            : null

          return (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={room.imageUrl}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-2">{room.area}</p>
                <div className="flex justify-between items-center">
                  <p className="text-blue-600 font-semibold">
                    ¥{room.price.toLocaleString()}/時間
                  </p>
                  {averageRating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span>{averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 mt-2">
                  最大{room.capacity}人 · {room.facilities.join(" · ")}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 