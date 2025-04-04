import type { Room, User, HourlyPriceWeekday, HourlyPriceHoliday } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ReservationConfirmForm from "@/components/ReservationConfirmForm"

type RoomWithPrices = Room & {
}

type Props = {
  searchParams: {
    roomId: string
    date: string
    startTime: string
    endTime: string
    totalPrice: string
  }
}

export const dynamic = 'force-dynamic'

export default async function ReservationConfirmPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const roomId = searchParams.roomId as string
  const date = searchParams.date as string
  const startTime = searchParams.startTime as string
  const endTime = searchParams.endTime as string
  const totalPrice = searchParams.totalPrice as string

  if (!roomId || !date || !startTime || !endTime || !totalPrice) {
    redirect("/")
  }

  const [room, user] = await Promise.all([
    prisma.room.findUnique({
      where: { id: roomId },
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
  ])

  if (!room || !user) {
    redirect("/")
  }

  return (
    <ReservationConfirmForm
      room={room}
      user={user}
      date={date}
      startTime={startTime}
      endTime={endTime}
      totalPrice={totalPrice}
    />
  )
} 