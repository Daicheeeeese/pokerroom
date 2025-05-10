'use client'

import { useState } from "react"
import Image from "next/image"
import { MapPinIcon } from "@heroicons/react/24/outline"
import { Train, Clock, BadgeCheck, Shuffle, UserPlus, Utensils, Nfc, Cigarette, Webcam, BatteryCharging, Wifi, GlassWater, Rabbit} from "lucide-react"
import { Card } from '@/components/ui/card'
import { Users } from 'lucide-react'
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
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日',
    };
    return days[day] || day;
  };

  const getBusinessHours = () => {
    const dayMapping: { [key: string]: string } = {
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日'
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
      if (hours.length === 0) return `${day}: 予約不可`;

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
      case 'beverages':
        return <GlassWater className="w-4 h-4 text-gray-900" />;       
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
      case 'beginner':
        return <Rabbit className="w-4 h-4 text-gray-900" />;        
      default:
        return <BadgeCheck className="w-4 h-4 text-gray-900" />;
    }
  };

  const getUnitDisplay = (unit: string) => {
    switch (unit) {
      case 'per_halfHour':
        return '/30分';
      case 'booking':
        return '/予約';
      case 'per_hour':
        return '/1時間';
      case 'per_hour_person':
        return '/1時間/人';  
        case 'per_person':
          return '/人';  
      default:
        return `/${unit}`;
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
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-0">
          {/* 設備タグ */}
          {room.tags && room.tags.length > 0 && (
            <div className="border-t border-b border-gray-200 py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">提供可能なサービス・設備</h3>
              <div className="flex flex-col gap-3">
                {room.tags.map((roomTag) => (
                  <div
                    key={roomTag.tag.id}
                    className="flex items-center gap-2 bg-white"
                  >
                    {getTagIcon(roomTag.tag.id)}
                    <span className="text-medium text-gray-700">{roomTag.tag.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-b border-gray-200 py-6">
            <h3 className="text-lg font-bold text-gray-900">住所・アクセス</h3>
            {room.latitude && room.longitude && (
              <div className="mt-2">
                <RoomMap
                  address={room.address}
                  latitude={room.latitude}
                  longitude={room.longitude}
                />
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4">
              <div className="text-mediumtext-gray-700">{room.address}</div>
              <div className="flex flex-col gap-1">
                {room.nearestStations.map((station) => (
                  <span key={station.id} className="text-mediumtext-gray-700">
                    {station.name} 徒歩{station.minutes}分
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 py-6">
            <h3 className="text-lg font-bold text-gray-900">収容人数</h3>
            <p className="mt-2 text-medium text-gray-600">{room.capacity}人</p>
          </div>

          <div className="border-b border-gray-200 py-6">
            <h3 className="text-lg font-bold text-gray-900">予約可能時間</h3>
            <p className="mt-2 font-medium text-gray-600 whitespace-pre-line">
              {getBusinessHours().join('\n')}
            </p>
          </div>

          <div className="border-b border-gray-200 py-6">
            <h3 className="text-lg font-bold text-gray-900">支払い方法</h3>
            <p className="mt-2 text-medium text-gray-600">現地決済</p>
          </div>
          {room.options && room.options.length > 0 && (
            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-900">オプション</h3>
              <div className="flex flex-col gap-4 mt-4">
                {room.options.map((option) => (
                  <div key={option.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-gray-900 font-medium">
                      {option.name}
                      {option.isRequired && <span className="text-red-600 ml-2">（必須）</span>}
                    </div>
                    <div className="font-mediumtext-gray-700 mt-1">
                      ¥{option.price.toLocaleString()}{getUnitDisplay(option.unit)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 hidden lg:block">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">料金</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ¥{(room.baseprice || 0).toLocaleString()}
                    <span className="text-base font-normal text-gray-500">/{room.unit === 'hour' ? '時間' : '人'}</span>
                    {room.notes?.some(note => note.extra.includes('dealer')) && (
                      <span className="text-base font-normal text-gray-500 ml-2">（ディーラー込み）</span>
                    )}
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
              ¥{(room.baseprice || 0).toLocaleString()}
              <span className="text-base font-normal text-gray-500">/{room.unit === 'hour' ? '時間' : '人'}</span>
              {room.notes?.some(note => note.extra.includes('dealer')) && (
                <span className="text-base font-normal text-gray-500 ml-2">（ディーラー込み）</span>
              )}
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