'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Train, Clock } from "lucide-react"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage, Review, NearestStation, RoomBusinessHours } from "@prisma/client"
import AvailabilityCalendar from "./AvailabilityCalendar"
import ReservationForm from '../ReservationForm'
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { formatPricePerHour } from '@/lib/format'
import { useSession } from "next-auth/react"
import Link from "next/link"

type RoomWithDetails = Room & {
  images: RoomImage[];
  hourlyPricesWeekday: HourlyPriceWeekday[];
  hourlyPricesHoliday: HourlyPriceHoliday[];
  reviews: Review[];
  nextAvailableDate: Date | null;
  businessHours: RoomBusinessHours[];
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

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: '月曜日',
      tuesday: '火曜日',
      wednesday: '水曜日',
      thursday: '木曜日',
      friday: '金曜日',
      saturday: '土曜日',
      sunday: '日曜日',
    };
    return days[day] || day;
  };

  const getBusinessHours = () => {
    const dayMapping: { [key: string]: string } = {
      monday: '月曜日',
      tuesday: '火曜日',
      wednesday: '水曜日',
      thursday: '木曜日',
      friday: '金曜日',
      saturday: '土曜日',
      sunday: '日曜日'
    };

    const businessHoursByDay = new Map<string, RoomBusinessHours[]>();

    // 曜日ごとに営業時間をグループ化
    room.businessHours.forEach((hours) => {
      const dayName = dayMapping[hours.day] || hours.day;
      const dayHours = businessHoursByDay.get(dayName) || [];
      dayHours.push(hours);
      businessHoursByDay.set(dayName, dayHours);
    });

    // 各曜日の営業時間をopenTimeでソート
    businessHoursByDay.forEach((hours, day) => {
      hours.sort((a, b) => a.openTime.localeCompare(b.openTime));
    });

    return Object.values(dayMapping).map((day) => {
      const hours = businessHoursByDay.get(day) || [];
      if (hours.length === 0) return `${day}: 予約不可`;

      // 同じ曜日の営業時間を結合
      const timeRanges = hours
        .map((h) => `${h.openTime}~${h.closeTime}`)
        .join(', ');

      return `${day}: ${timeRanges}`;
    });
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
              {getBusinessHours().join('\n')}
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