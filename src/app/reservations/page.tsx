import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ReservationList from "@/components/ReservationList"

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      room: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">マイ予約</h1>
      <ReservationList reservations={reservations} />
    </div>
  )
} 