'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Option {
  id: string
  name: string
  description: string | null
  price: number
}

interface Room {
  id: string
  name: string
  address: string
  pricePerHour: number
  hourlyPricesWeekday: Array<{
    startTime: string
    endTime: string
    pricePerHour: number
  }>
  hourlyPricesHoliday: Array<{
    startTime: string
    endTime: string
    pricePerHour: number
  }>
  options: Array<{
    option: Option
  }>
}

interface SelectedOption {
  optionId: string
  quantity: number
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
        if (!response.ok) {
          throw new Error('ルームの取得に失敗しました')
        }
        const data = await response.json()
        setRoom(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (roomId) {
      fetchRoom()
    }
  }, [roomId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '予約の作成に失敗しました')
      }

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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">エラー</h1>
        <Card className="p-6">
          <p className="text-red-600">必要な情報が不足しています</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">読み込み中...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">エラー</h1>
        <Card className="p-6">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">エラー</h1>
        <Card className="p-6">
          <p className="text-red-600">ルームが見つかりません</p>
        </Card>
      </div>
    )
  }

  const formattedDate = format(new Date(date), 'yyyy年MM月dd日', { locale: ja })
  const isHoliday = new Date(date).getDay() === 0 || new Date(date).getDay() === 6
  const hourlyPrices = isHoliday ? room.hourlyPricesHoliday : room.hourlyPricesWeekday

  const calculateRoomPrice = () => {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    let totalPrice = 0

    for (let time = start; time < end; time.setMinutes(time.getMinutes() + 30)) {
      const hour = time.getHours()
      const price = hourlyPrices.find(p => {
        const start = parseInt(p.startTime.split(':')[0])
        const end = parseInt(p.endTime.split(':')[0])
        return hour >= start && hour < end
      })?.pricePerHour || room.pricePerHour
      totalPrice += price / 2
    }

    return totalPrice
  }

  const calculateOptionsPrice = () => {
    return selectedOptions.reduce((total, { optionId, quantity }) => {
      const option = room.options.find(o => o.option.id === optionId)?.option
      return total + (option ? option.price * quantity : 0)
    }, 0)
  }

  const roomPrice = calculateRoomPrice()
  const optionsPrice = calculateOptionsPrice()
  const totalPrice = roomPrice + optionsPrice

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">予約内容の確認</h1>
      
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">予約内容</h2>
            <div className="mt-2 space-y-2">
              <p>ポーカールーム: {room.name}</p>
              <p>住所: {room.address}</p>
              <p>日付: {formattedDate}</p>
              <p>時間: {startTime} ~ {endTime}</p>
              <p>人数: {numberOfPeople}人</p>
              <p>ルーム料金: ¥{roomPrice.toLocaleString()}</p>
              
              {selectedOptions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-900">選択されたオプション</h3>
                  <div className="mt-2 space-y-2">
                    {selectedOptions.map(({ optionId, quantity }) => {
                      const option = room.options.find(o => o.option.id === optionId)?.option
                      if (!option) return null
                      return (
                        <div key={optionId} className="flex justify-between">
                          <span>{option.name} × {quantity}</span>
                          <span>¥{(option.price * quantity).toLocaleString()}</span>
                        </div>
                      )
                    })}
                    <p className="text-right">オプション料金: ¥{optionsPrice.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              <p className="text-lg font-bold mt-4">合計金額: ¥{totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? '予約処理中...' : '予約する'}
          </button>
        </form>
      </Card>
    </div>
  )
} 