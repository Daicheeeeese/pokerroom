'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Option {
  id: string
  name: string
  price: number
  unit: string
  isRequired: boolean
}

interface SelectedOption {
  optionId: string
  quantity: number
}

interface Room {
  id: string
  name: string
  address: string
  pricePerHour: number
  options: Option[]
  nearestStation: string
}

const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0
  
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  // 24時間を超える時間を考慮
  const startTotalMinutes = startHour * 60 + startMinute
  const endTotalMinutes = endHour * 60 + endMinute
  const diffInMinutes = endTotalMinutes - startTotalMinutes
  
  return diffInMinutes / 60
}

const calculateOptionPrice = (option: Option, duration: number, numberOfPeople: number): number => {
  switch (option.unit) {
    case 'per_hour':
      return option.price * duration
    case 'per_hour_person':
      return option.price * duration * numberOfPeople
    case 'per_halfHour':
      return option.price * duration * 2
    case 'booking':
      return option.price
    default:
      return 0
  }
}

const getUnitText = (unit: string): string => {
  switch (unit) {
    case 'per_halfHour':
      return '30分あたり'
    case 'booking':
      return '予約あたり'
    case 'per_hour':
      return '1時間あたり'
    case 'per_hour_person':
      return '1人1時間あたり'
    default:
      return ''
  }
}

export default function ReservationConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const date = searchParams.get('date')
  const startTime = searchParams.get('startTime')
  const endTime = searchParams.get('endTime')
  const numberOfPeople = searchParams.get('numberOfPeople')
  const optionsParam = searchParams.get('options')
  const selectedOptions: SelectedOption[] = optionsParam ? JSON.parse(optionsParam) : []

  const [room, setRoom] = useState<Room | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`)
        if (!response.ok) throw new Error('ルームの取得に失敗しました')
        const data: Room = await response.json()
        setRoom(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }
    if (roomId) fetchRoom()
  }, [roomId])

  // 日付・時間計算
  const formattedDate = date ? format(new Date(date), 'yyyy年MM月dd日', { locale: ja }) : ''

  const calculateRoomPrice = () => {
    if (!startTime || !endTime || !room) return 0
    const duration = calculateDuration(startTime, endTime)
    return room.pricePerHour * duration
  }

  const calculateOptionsPrice = () => {
    if (!room || !startTime || !endTime || !numberOfPeople) return 0

    const duration = calculateDuration(startTime, endTime)
    const peopleCount = parseInt(numberOfPeople)

    return selectedOptions.reduce((sum, { optionId }) => {
      const option = room.options.find(o => o.id === optionId)
      if (!option) return sum
      return sum + calculateOptionPrice(option, duration, peopleCount)
    }, 0)
  }

  const calculateTotalPrice = () => {
    return calculateRoomPrice() + calculateOptionsPrice()
  }

  const roomPrice = calculateRoomPrice()
  const optionsPrice = calculateOptionsPrice()
  const totalPrice = calculateTotalPrice()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          date,
          startTime,
          endTime,
          people: parseInt(numberOfPeople || '1'),
          options: selectedOptions,
          totalPrice,
        }),
      })
      if (!response.ok) throw new Error('予約の作成に失敗しました')
      const data = await response.json()
      router.push(`/reservations/${data.id}/complete`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予約の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!roomId || !date || !startTime || !endTime || !numberOfPeople) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <p className="text-red-600">必要な情報が不足しています</p>
        </Card>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p>読み込み中...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }
  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-6">
          <p className="text-red-600">ルームが見つかりません</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">予約内容の確認</h1>
      <Card className="p-6 mb-8">
        <p>ポーカールーム: {room.name}</p>
        <p>住所: {room.address}</p>
        <p>利用日: {formattedDate}</p>
        <p>利用時間: {startTime} ~ {endTime}</p>
        <p>利用人数: {numberOfPeople}人</p>
        <p>ルーム料金: ¥{roomPrice.toLocaleString()}</p>
        {selectedOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">選択されたオプション</h3>
            <div className="mt-2 space-y-2">
              {selectedOptions.map(({ optionId }) => {
                const opt = room.options.find(o => o.id === optionId)
                if (!opt) return null
                return (
                  <div key={optionId} className="flex justify-between">
                    <span>{opt.name} {getUnitText(opt.unit)}</span>
                    <span>¥{opt.price.toLocaleString()}/{opt.unit === 'per_hour' ? '時間' : opt.unit === 'per_hour_person' ? '一人1時間' : '予約'}</span>
                  </div>
                )
              })}
            </div>
            <p className="text-right">オプション料金: ¥{optionsPrice.toLocaleString()}</p>
          </div>
        )}
        <p className="text-lg font-bold mt-4">合計金額: ¥{totalPrice.toLocaleString()}</p>
      </Card>
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '予約処理中...' : '予約する'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            お支払いは予約確定後、オンラインまたは現地での対応となります。
          </p>
        </form>
      </Card>
    </div>
  )
}
