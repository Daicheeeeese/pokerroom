import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ReservationDetail } from "./ReservationDetail"

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

  return <ReservationDetail reservation={reservation} />
} 