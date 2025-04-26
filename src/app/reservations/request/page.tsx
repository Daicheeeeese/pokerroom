'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { isWeekend } from '@/lib/utils'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './datepicker.css'

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

export default function ReservationRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  const [date, setDate] = useState<string>('')
  const [startHour, setStartHour] = useState<string>('')
  const [startMinute, setStartMinute] = useState<string>('00')
  const [endHour, setEndHour] = useState<string>('')
  const [endMinute, setEndMinute] = useState<string>('00')
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({})
  const [room, setRoom] = useState<Room | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isOpen, setIsOpen] = useState(false)

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
    if (!startHour) return generateTimeOptions()

    const startHourNum = parseInt(startHour)
    return Array.from({ length: 28 }, (_, i) => i)
      .filter(hour => hour > startHourNum)
      .map(hour => hour.toString().padStart(2, '0'))
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

    if (!selectedDate || !startHour || !startMinute || !endHour || !endMinute) {
      setError('利用日と利用時間を選択してください')
      return
    }

    if (!roomId) {
      setError('ルームIDが指定されていません')
      return
    }

    const startTime = `${startHour}:${startMinute}`
    const endTime = `${endHour}:${endMinute}`

    const selectedOptionsList = Object.entries(selectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([optionId]) => ({ optionId, quantity: 1 }))

    const queryParams = new URLSearchParams({
      roomId,
      date: selectedDate.toISOString().split('T')[0],
      startTime,
      endTime,
      numberOfPeople: numberOfPeople.toString(),
      options: JSON.stringify(selectedOptionsList),
    })

    router.push(`/reservations/confirm?${queryParams.toString()}`)
  }

  const calculateTotalPrice = (): number => {
    if (!room || !startHour || !startMinute || !endHour || !endMinute) return 0

    const duration = calculateDuration(`${startHour}:${startMinute}`, `${endHour}:${endMinute}`)
    const selectedDate = date ? new Date(date) : null
    const isHoliday = selectedDate ? isWeekend(selectedDate) : false

    // 土日かつ時間帯別料金が設定されている場合のみ、時間帯別料金を使用
    const basePrice = isHoliday && room.hourlyPricesHoliday.length > 0
      ? calculateHolidayPrice(room, `${startHour}:${startMinute}`, `${endHour}:${endMinute}`)
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
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    let total = 0

    // 30分刻みで時間を進める
    for (let hour = startHour, minute = startMinute; 
         hour < endHour || (hour === endHour && minute < endMinute); 
         minute += 30) {
      if (minute >= 60) {
        hour += 1
        minute = 0
      }

      const currentHour = hour % 24 // 24時間を超える時間を考慮
      const price = room.hourlyPricesHoliday.find(p => {
        const [sHour] = p.startTime.split(':').map(Number)
        const [eHour] = p.endTime.split(':').map(Number)
        return currentHour >= sHour && currentHour < eHour
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              利用日
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate ? format(selectedDate, 'yyyy年MM月dd日') : ''}
                onClick={() => setIsOpen(true)}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="利用日を選択"
              />
            </div>
            {isOpen && (
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setIsOpen(false);
                }}
                minDate={new Date()}
                inline
                open={isOpen}
                onInputClick={() => setIsOpen(true)}
                onClickOutside={() => setIsOpen(false)}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">開始時間</label>
            <div className="flex gap-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">時</option>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour}時
                  </option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="00">00分</option>
                <option value="30">30分</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">終了時間</label>
            <div className="flex gap-2">
              <select
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">時</option>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={hour.toString().padStart(2, '0')}>
                    {hour}時
                  </option>
                ))}
              </select>
              <select
                value={startMinute}
                onChange={(e) => setStartMinute(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="00">00分</option>
                <option value="30">30分</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">利用人数</label>
            <select
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Array.from({ length: 19 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}名
                </option>
              ))}
              <option value={20}>20名以上</option>
            </select>
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