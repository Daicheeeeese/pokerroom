'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Option {
  id: string
  name: string
  description?: string | null
  price: number
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
  hourlyPricesWeekday: {
    startTime: string
    endTime: string
    pricePerHour: number
  }[]
  hourlyPricesHoliday: {
    startTime: string
    endTime: string
    pricePerHour: number
  }[]
  options: Option[]
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
  const isHoliday = date ? [0, 6].includes(new Date(date).getDay()) : false
  const hourlyPrices = room
    ? isHoliday
      ? room.hourlyPricesHoliday
      : room.hourlyPricesWeekday
    : []

  const calculateRoomPrice = () => {
    if (!startTime || !endTime || !room) return 0
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    let total = 0
    for (let t = new Date(start); t < end; t.setMinutes(t.getMinutes() + 30)) {
      const hour = t.getHours()
      const price = hourlyPrices.find(p => {
        const [sHour] = p.startTime.split(':').map(Number)
        const [eHour] = p.endTime.split(':').map(Number)
        return hour >= sHour && hour < eHour
      })?.pricePerHour ?? room.pricePerHour
      total += price / 2
    }
    return total
  }

  const calculateOptionsPrice = () => {
    if (!room) return 0
    return selectedOptions.reduce((sum, { optionId, quantity }) => {
      const opt = room.options.find(o => o.id === optionId)
      return sum + (opt ? opt.price * quantity : 0)
    }, 0)
  }

  const roomPrice = calculateRoomPrice()
  const optionsPrice = calculateOptionsPrice()
  const totalPrice = roomPrice + optionsPrice

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
        <p>日付: {formattedDate}</p>
        <p>時間: {startTime} ~ {endTime}</p>
        <p>人数: {numberOfPeople}人</p>
        <p>ルーム料金: ¥{roomPrice.toLocaleString()}</p>
        {selectedOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">選択されたオプション</h3>
            <div className="mt-2 space-y-2">
              {selectedOptions.map(({ optionId, quantity }) => {
                const opt = room.options.find(o => o.id === optionId)
                if (!opt) return null
                return (
                  <div key={optionId} className="flex justify-between">
                    <span>{opt.name} × {quantity}</span>
                    <span>¥{(opt.price * quantity).toLocaleString()}</span>
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
        </form>
      </Card>
    </div>
  )
}
