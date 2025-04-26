'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { isWeekend } from '@/lib/utils'

interface Option {
  id: string
  name: string
  price: number
  unit: string
  isRequired: boolean
}

interface Room {
  id: string
  name: string
  pricePerHour: number
  options: Option[]
  hourlyPricesHoliday: { startTime: string; endTime: string; pricePerHour: number }[]
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

const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0
  
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return diffInHours
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

export default function ReservationRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  const [date, setDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({})
  const [room, setRoom] = useState<Room | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

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

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour <= 27; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        options.push(timeString)
      }
    }
    return options
  }

  const getAvailableEndTimes = () => {
    if (!startTime) return generateTimeOptions()

    const start = new Date(`2000-01-01T${startTime}`)
    return generateTimeOptions().filter(time => {
      const end = new Date(`2000-01-01T${time}`)
      return end > start
    })
  }

  const handleOptionChange = (optionId: string, checked: boolean) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!date || !startTime || !endTime) {
      setError('日付と時間を選択してください')
      return
    }

    if (!roomId) {
      setError('ルームIDが指定されていません')
      return
    }

    const selectedOptionsList = Object.entries(selectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([optionId]) => ({ optionId, quantity: 1 }))

    const queryParams = new URLSearchParams({
      roomId,
      date,
      startTime,
      endTime,
      numberOfPeople: numberOfPeople.toString(),
      options: JSON.stringify(selectedOptionsList),
    })

    router.push(`/reservations/confirm?${queryParams.toString()}`)
  }

  const calculateTotalPrice = (): number => {
    if (!room || !startTime || !endTime) return 0

    const duration = calculateDuration(startTime, endTime)
    const selectedDate = date ? new Date(date) : null
    const isHoliday = selectedDate ? isWeekend(selectedDate) : false

    // 土日かつ時間帯別料金が設定されている場合のみ、時間帯別料金を使用
    const basePrice = isHoliday && room.hourlyPricesHoliday.length > 0
      ? calculateHolidayPrice(room, startTime, endTime)
      : room.pricePerHour * duration

    const optionsPrice = room.options
      .filter(option => selectedOptions[option.id])
      .reduce((total, option) => {
        return total + calculateOptionPrice(option, duration, numberOfPeople)
      }, 0)

    return basePrice + optionsPrice
  }

  // 土日の時間帯別料金を計算する関数
  const calculateHolidayPrice = (room: Room, startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    let total = 0

    for (let t = new Date(start); t < end; t.setMinutes(t.getMinutes() + 30)) {
      const hour = t.getHours()
      const price = room.hourlyPricesHoliday.find(p => {
        const [sHour] = p.startTime.split(':').map(Number)
        const [eHour] = p.endTime.split(':').map(Number)
        return hour >= sHour && hour < eHour
      })?.pricePerHour ?? room.pricePerHour
      total += price / 2
    }

    return total
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">予約リクエスト</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">開始時間</label>
            <select
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
                if (endTime && new Date(`2000-01-01T${endTime}`) <= new Date(`2000-01-01T${e.target.value}`)) {
                  setEndTime('')
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">選択してください</option>
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">終了時間</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={!startTime}
            >
              <option value="">選択してください</option>
              {getAvailableEndTimes().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">人数</label>
            <input
              type="number"
              min="1"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {room?.options && room.options.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">オプション</h3>
              <div className="space-y-4">
                {room.options.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`option-${option.id}`}
                        checked={selectedOptions[option.id] || false}
                        onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`option-${option.id}`} className="ml-3">
                        <p className="font-medium">{option.name}</p>
                        <p className="text-sm text-gray-500">
                          ¥{option.price.toLocaleString()}（{getUnitText(option.unit)}）
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">合計金額</span>
              <span className="text-xl font-bold">
                ¥{calculateTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            予約に進む
          </button>
        </form>
      </Card>
    </div>
  )
} 