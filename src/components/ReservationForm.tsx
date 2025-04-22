"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage } from "@prisma/client"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSession } from 'next-auth/react'
import type { Prisma } from '@prisma/client'

type RoomWithDetails = {
  id: string
  name: string
  description: string
  address: string
  capacity: number
  pricePerHour: number
  amenities: string[]
  createdAt: Date
  updatedAt: Date
  images: RoomImage[]
  hourlyPricesWeekday: HourlyPriceWeekday[]
  hourlyPricesHoliday: HourlyPriceHoliday[]
  businessHours: {
    day: string
    openTime: string
    closeTime: string
  }[]
  options: {
    option: {
      id: string
      name: string
      description: string | null
      price: number
    }
  }[]
}

type RoomWithOptions = Prisma.RoomGetPayload<{
  include: {
    options: {
      include: {
        option: true;
      };
    };
  };
}>

type Props = {
  room: RoomWithOptions
}

export default function ReservationForm({ room }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [people, setPeople] = useState<number>(1)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")

  const calculateTotalPrice = () => {
    if (!date || !startTime || !endTime) return 0

    const start = new Date(`${date.toISOString().split('T')[0]}T${startTime}`)
    const end = new Date(`${date.toISOString().split('T')[0]}T${endTime}`)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    let totalPrice = room.pricePerHour * diffHours

    // オプション料金の計算
    Object.entries(selectedOptions).forEach(([optionId, isSelected]) => {
      if (isSelected) {
        const roomOption = room.options.find(opt => opt.optionId === optionId)
        if (roomOption) {
          const option = roomOption.option
          switch (option.unit) {
            case 'booking':
              totalPrice += option.price
              break
            case 'per_hour':
              totalPrice += option.price * diffHours
              break
            case 'per_halfHour':
              totalPrice += option.price * (diffHours * 2)
              break
            case 'per_hour_person':
              totalPrice += option.price * diffHours * people
              break
          }
        }
      }
    })

    return Math.round(totalPrice)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push('/login')
      return
    }

    if (!date || !startTime || !endTime) {
      setError('日付と時間を選択してください')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          date,
          startTime,
          endTime,
          people,
          options: Object.entries(selectedOptions)
            .filter(([_, isSelected]) => isSelected)
            .map(([optionId]) => optionId),
        }),
      })

      if (!response.ok) {
        throw new Error('予約の作成に失敗しました')
      }

      const data = await response.json()
      setSuccessMessage('予約が完了しました')
      router.push(`/reservations/${data.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : '予約の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeOptions = []
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 2; j++) {
      const hour = i.toString().padStart(2, '0')
      const minute = (j * 30).toString().padStart(2, '0')
      timeOptions.push(`${hour}:${minute}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">日付</label>
        <DatePicker
          selected={date}
          onChange={setDate}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          dateFormat="yyyy/MM/dd"
          minDate={new Date()}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">開始時間</label>
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {timeOptions.map((time) => (
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
        >
          <option value="">選択してください</option>
          {timeOptions.map((time) => (
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
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {room.options.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">オプション</label>
          <div className="mt-2 space-y-4">
            {room.options.map((roomOption) => (
              <div key={roomOption.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${roomOption.id}`}
                  checked={selectedOptions[roomOption.optionId] || false}
                  onChange={(e) => {
                    setSelectedOptions({
                      ...selectedOptions,
                      [roomOption.optionId]: e.target.checked,
                    })
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`option-${roomOption.id}`} className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    {roomOption.option.name}
                  </span>
                  {roomOption.option.description && (
                    <span className="block text-sm text-gray-500">
                      {roomOption.option.description}
                    </span>
                  )}
                  <span className="block text-sm text-gray-600">
                    {roomOption.option.price.toLocaleString()}円
                    {roomOption.option.unit === 'per_hour' && '/時間'}
                    {roomOption.option.unit === 'per_halfHour' && '/30分'}
                    {roomOption.option.unit === 'per_hour_person' && '/時間/人'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xl font-bold text-gray-900">
        合計金額: {calculateTotalPrice().toLocaleString()}円
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {successMessage && <div className="text-green-600">{successMessage}</div>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? '予約中...' : '予約する'}
      </button>
    </form>
  )
} 