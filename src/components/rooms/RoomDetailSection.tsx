'use client'

import { RoomWithDetails } from '@/types/room'
import { formatPricePerHour } from '@/lib/format'
import ReservationForm from '@/components/ReservationForm'
import { Card } from '@/components/ui/card'
import { MapPin, Users, Clock } from 'lucide-react'

interface Props {
  room: RoomWithDetails
}

export function RoomDetailSection({ room }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 左側：部屋の詳細情報 */}
      <div className="space-y-6">
        {/* 定員 */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-medium">定員</h3>
              <p className="text-gray-500">{room.capacity}名</p>
            </div>
          </div>
        </Card>

        {/* 料金 */}
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-medium">料金</h3>
              <p className="text-gray-500">{formatPricePerHour(room.price)}/時間</p>
              <p className="text-xs text-gray-400 mt-1">※土日祝日や時間帯により料金が変動する場合があります</p>
            </div>
          </div>
        </Card>

        {/* 住所 */}
        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">住所・アクセス</h3>
            <p className="text-gray-600">{room.address}</p>
          </div>
        </Card>

        {/* 最寄駅 */}
        <Card className="p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">最寄駅</h3>
            <div className="text-gray-600">
              {room.nearestStations && room.nearestStations.length > 0 ? (
                <ul className="list-disc pl-5">
                  {room.nearestStations.map((station, index) => (
                    <li key={index}>{station.name}（{station.transport}{station.minutes}分）</li>
                  ))}
                </ul>
              ) : (
                <p>最寄駅情報はありません</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 右側：予約フォーム */}
      <div>
        <ReservationForm room={room} />
      </div>
    </div>
  )
} 