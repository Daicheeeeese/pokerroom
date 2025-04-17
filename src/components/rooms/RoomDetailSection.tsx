'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Train } from "lucide-react"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Review, NearestStation } from "@prisma/client"
import AvailabilityCalendar from "./AvailabilityCalendar"
import ReservationForm from "../ReservationForm"
import { Card } from '@/components/ui/card'
import { Users, Clock } from 'lucide-react'
import { formatPricePerHour } from '@/lib/format'
import { useSession } from "next-auth/react"
import Link from "next/link"

type RoomWithDetails = Room & {
  image: string
  images: RoomImage[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  reviews: Review[]
  nearestStations: NearestStation[]
}

type Props = {
  room: RoomWithDetails
  selectedDate?: Date | null
}

export default function RoomDetailSection({ room, selectedDate }: Props) {
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(selectedDate || null)
  const { data: session } = useSession()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={room.image || '/placeholder.png'}
                alt={room.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">料金</h2>
              <p className="text-gray-600">
                {formatPricePerHour(room.pricePerHour)}~/時間
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ※土日祝日や時間帯により料金が変動する場合があります
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">収容人数</h2>
              <p className="text-gray-600">最大{room.capacity}人</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">住所</h2>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-500" />
                <p className="text-gray-600">{room.address}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">最寄駅</h2>
              <div className="space-y-2">
                {room.nearestStations?.map((station: NearestStation) => (
                  <div key={station.id} className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-600">
                      {station.name}{station.transport}{station.minutes}分
                    </p>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">予約する</h3>
              {session ? (
                <>
                  <ReservationForm room={room} />
                  <p className="text-sm text-gray-500 mt-1 text-center sm:text-left">※予約はまだ確定されません</p>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">※予約するには<Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>をしてください</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 