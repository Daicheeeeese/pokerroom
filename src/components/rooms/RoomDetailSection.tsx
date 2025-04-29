'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Train, Clock, BadgeCheck, Shuffle, UserPlus, Utensils, Nfc, Cigarette, Webcam, BatteryCharging, Wifi } from "lucide-react"
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { formatPricePerHour } from '@/lib/format'
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RoomMap } from './RoomMap'
import { RoomWithDetails } from '@/types/room'

interface Props {
  room: RoomWithDetails;
}

export function RoomDetailSection({ room }: Props) {
  const { data: session } = useSession()
  const router = useRouter()

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

    const businessHoursByDay = new Map<string, typeof room.businessHours[0][]>();

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
      if (hours.length === 0) return `${day}: 定休日`;

      // 同じ曜日の営業時間を結合
      const timeRanges = hours
        .map((h) => `${formatTime(h.openTime)}~${formatTime(h.closeTime)}`)
        .join(', ');

      return `${day}: ${timeRanges}`;
    });
  };

  const getTagIcon = (tagId: string) => {
    switch (tagId) {
      case 'autoshuffle':
        return <Shuffle className="w-4 h-4 text-gray-900" />;
      case 'dealer':
        return <UserPlus className="w-4 h-4 text-gray-900" />;
      case 'foods':
        return <Utensils className="w-4 h-4 text-gray-900" />;
      case 'rfidtable':
        return <Nfc className="w-4 h-4 text-gray-900" />;
      case 'smoking':
        return <Cigarette className="w-4 h-4 text-gray-900" />;
      case 'streaming':
        return <Webcam className="w-4 h-4 text-gray-900" />;
      case 'usbport':
        return <BatteryCharging className="w-4 h-4 text-gray-900" />;
      case 'wifi':
        return <Wifi className="w-4 h-4 text-gray-900" />;
      default:
        return <BadgeCheck className="w-4 h-4 text-gray-900" />;
    }
  };

  const handleReservationClick = () => {
    if (!session) {
      router.push('/login')
      return
    }
    router.push(`/reservations/request?roomId=${room.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* 設備タグ */}
          {room.tags && room.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">提供可能な設備</h3>
              <div className="flex flex-wrap gap-3">
                {room.tags.map((roomTag) => (
                  <div
                    key={roomTag.tag.id}
                    className="flex items-center gap-1 bg-white"
                  >
                    {getTagIcon(roomTag.tag.id)}
                    <span className="text-sm text-gray-700">{roomTag.tag.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900">収容人数</h3>
            <p className="mt-2 text-gray-600">{room.capacity}人</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">営業時間</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">
              {getBusinessHours().join('\n')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">住所</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{room.address}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">最寄駅</h3>
            {room.nearestStations.map((station) => (
                <div key={station.id} className="flex items-center gap-1">
                  <Train className="w-4 h-4" />
                  {`${station.name}${station.transport}${station.minutes}分`}
                </div>
              ))}
          </div>
        </div>

        <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">地図</h3>
            <RoomMap
              address={room.address}
              latitude={room.latitude}
              longitude={room.longitude}
            />
          </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 hidden lg:block">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">料金</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{(room.pricePerHour || 0).toLocaleString()}
                    <span className="text-lg font-normal text-gray-500">/時間</span>
                  </p>
                </div>
                {session ? (
                  <button
                    onClick={handleReservationClick}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    予約
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">※予約するには<Link href="/login" className="text-blue-600 hover:underline">ログイン</Link>をしてください</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* スマホ用の固定予約ボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-5 lg:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ¥{(room.pricePerHour || 0).toLocaleString()}
              <span className="text-base font-normal text-gray-500">/時間</span>
            </p>
          </div>
          {session ? (
            <button
              onClick={() => router.push(`/reservations/request?roomId=${room.id}`)}
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
            >
              予約する
            </button>
          ) : (
            <Link
              href="/login"
              className="text-blue-600 hover:underline text-lg"
            >
              ログインして予約
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 