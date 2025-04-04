import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { notFound } from "next/navigation"

type Props = {
  params: {
    id: string
  }
}

// 動的ルーティングを強制
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ReservationDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return notFound()
  }

  const reservation = await prisma.reservation.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      room: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!reservation) {
    return notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">予約詳細</h1>
      <p className="text-gray-600">予約が完了いたしました。</p>
      
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">{reservation.room.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">予約日</p>
              <p className="font-medium">
                {format(new Date(reservation.date), "yyyy年MM月dd日")}
              </p>
            </div>
            <div>
              <p className="text-gray-600">時間</p>
              <p className="font-medium">
                {reservation.startTime} 〜 {reservation.endTime}
              </p>
            </div>
            <div>
              <p className="text-gray-600">料金</p>
              <p className="font-medium">¥{reservation.totalPrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">予約者</p>
              <p className="font-medium">{reservation.user.name}</p>
              <p className="text-sm text-gray-500">{reservation.user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">部屋の詳細</h3>
          <p className="text-gray-600 mb-2">{reservation.room.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">収容人数</p>
              <p className="font-medium">{reservation.room.capacity}人</p>
            </div>
            <div>
              <p className="text-gray-600">時間単価</p>
              <p className="font-medium">¥{reservation.room.pricePerHour.toLocaleString()}/時間</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 