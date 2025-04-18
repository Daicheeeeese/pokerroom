'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Train, Clock } from "lucide-react"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Review, NearestStation } from "@prisma/client"
import AvailabilityCalendar from "./AvailabilityCalendar"
import ReservationForm from '../ReservationForm'
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { formatPricePerHour } from '@/lib/format'
import { useSession } from "next-auth/react"
import Link from "next/link"
import { RoomWithDetails } from '@/types/room'

type RoomWithDetails = Room & {
  images: RoomImage[];
  hourlyPricesWeekday: HourlyPriceWeekday[];
  hourlyPricesHoliday: HourlyPriceHoliday[];
  reviews: Review[];
  nextAvailableDate: Date | null;
  businessHours: {
    id: string;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }[];
};

interface Props {
  room: RoomWithDetails;
  selectedDate?: Date | null;
}

export function RoomDetailSection({ room, selectedDate }: Props) {
  const [selectedDateState, setSelectedDateState] = useState<Date | null>(selectedDate || null)
  const { data: session } = useSession()

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const getDayName = (dayOfWeek: number) => {
    const days: { [key: number]: string } = {
      0: '日曜日',
      1: '月曜日',
      2: '火曜日',
      3: '水曜日',
      4: '木曜日',
      5: '金曜日',
      6: '土曜日',
    };
    return days[dayOfWeek] || '';
  };

  const formatBusinessHours = (hours: { id: string; dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[]) => {
    const groupedHours = hours.reduce((acc, hour) => {
      if (!acc[hour.dayOfWeek]) {
        acc[hour.dayOfWeek] = [];
      }
      acc[hour.dayOfWeek].push(hour);
      return acc;
    }, {} as { [key: number]: { id: string; dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }[] });

    const result = [];
    for (let i = 0; i < 7; i++) {
      const dayHours = groupedHours[i] || [];
      if (dayHours.length === 0 || dayHours.every(h => h.isClosed)) {
        result.push(`${getDayName(i)}：定休日`);
      } else {
        const timeRanges = dayHours
          .filter(h => !h.isClosed)
          .map(h => `${formatTime(h.openTime)}~${formatTime(h.closeTime)}`)
          .join(', ');
        result.push(`${getDayName(i)}：${timeRanges}`);
      }
    }

    return result.join('\n');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900">収容人数</h3>
            <p className="mt-2 text-gray-600">{room.capacity}人</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">料金</h3>
            <p className="mt-2 text-gray-600">
              {room.pricePerHour.toLocaleString()}円/時間
            </p>
            <p className="mt-1 text-sm text-gray-500">
              ※土日祝日や時間帯により料金が変動する場合があります
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">住所</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{room.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">営業時間</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {formatBusinessHours(room.businessHours)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              ※表示時間外でも予約可能です
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">予約する</h3>
              {session ? (
                <>
                  <AvailabilityCalendar
                    roomId={room.id}
                    selectedDate={selectedDateState}
                    onDateSelect={setSelectedDateState}
                  />
                  <div className="mt-4">
                    <ReservationForm room={room} selectedDate={selectedDateState} />
                  </div>
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