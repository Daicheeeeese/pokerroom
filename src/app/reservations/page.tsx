import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Image from "next/image"

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      room: true
    },
    orderBy: {
      date: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">予約一覧</h1>
      {reservations.length === 0 ? (
        <p className="text-gray-600">予約はありません</p>
      ) : (
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-32">
                  <Image
                    src={reservation.room.image}
                    alt={reservation.room.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {reservation.room.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">日付</p>
                      <p className="font-medium">
                        {new Date(reservation.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">時間</p>
                      <p className="font-medium">
                        {reservation.startTime} - {reservation.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">料金</p>
                      <p className="font-medium">
                        ¥{reservation.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">予約日時</p>
                      <p className="font-medium">
                        {new Date(reservation.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 