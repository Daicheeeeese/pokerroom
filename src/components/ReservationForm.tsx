"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Room, HourlyPriceWeekday, HourlyPriceHoliday, RoomImage } from "@prisma/client"

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

type Props = {
  room: RoomWithDetails
  selectedDate?: Date | null
}

export default function ReservationForm({ room, selectedDate }: Props) {
  const router = useRouter()
  const [date, setDate] = useState<string>(selectedDate ? selectedDate.toISOString().split('T')[0] : '')
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string>("")

  const calculateTotalPrice = () => {
    if (!date || !startTime || !endTime) return 0

    const selectedDate = new Date(date)
    const isHoliday = selectedDate.getDay() === 0 || selectedDate.getDay() === 6
    const hourlyPrices = isHoliday ? room.hourlyPricesHoliday : room.hourlyPricesWeekday

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    let totalPrice = 0
    const startHour = start.getHours()
    const startMinutes = start.getMinutes()

    for (let i = 0; i < diffHours * 2; i++) {
      const currentMinutes = startMinutes + i * 30
      const currentHour = startHour + Math.floor(currentMinutes / 60)
      const timeString = `${currentHour.toString().padStart(2, '0')}:${(currentMinutes % 60).toString().padStart(2, '0')}`

      const hourlyPrice = hourlyPrices.find(price => price.startTime <= timeString && price.endTime > timeString)
      totalPrice += hourlyPrice ? hourlyPrice.pricePerHour / 2 : room.pricePerHour / 2
    }

    // オプションの料金を追加
    Object.entries(selectedOptions).forEach(([optionId, quantity]) => {
      const option = room.options.find(opt => opt.option.id === optionId)
      if (option) {
        totalPrice += option.option.price * quantity
      }
    })

    return totalPrice
  }

  const handleOptionChange = (optionId: string, quantity: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: quantity
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    if (!date || !startTime || !endTime) {
      setError("日付と時間を選択してください")
      setIsSubmitting(false)
      return
    }

    const selectedDate = new Date(date)
    const dayOfWeek = selectedDate.getDay()
    const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const day = dayMapping[dayOfWeek]

    if (!room.businessHours.some(hours => hours.day === day)) {
      setError("選択された日付は予約できません")
      setIsSubmitting(false)
      return
    }

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)

    if (end <= start) {
      setError("終了時間は開始時間より後である必要があります")
      setIsSubmitting(false)
      return
    }

    const totalPrice = calculateTotalPrice()
    const queryParams = new URLSearchParams({
      roomId: room.id,
      date,
      startTime,
      endTime,
      totalPrice: totalPrice.toString(),
      ...Object.entries(selectedOptions).reduce((acc, [optionId, quantity]) => {
        acc[`option_${optionId}`] = quantity.toString()
        return acc
      }, {} as Record<string, string>)
    })

    router.push(`/reservations/confirm?${queryParams.toString()}`)
  }

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              setEndTime("")
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

      {room.options.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">オプション</h3>
          {room.options.map(({ option }) => (
            <div key={option.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{option.name}</p>
                {option.description && (
                  <p className="text-sm text-gray-500">{option.description}</p>
                )}
                <p className="text-sm text-gray-900">¥{option.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOptionChange(option.id, Math.max(0, (selectedOptions[option.id] || 0) - 1))}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{selectedOptions[option.id] || 0}</span>
                <button
                  type="button"
                  onClick={() => handleOptionChange(option.id, (selectedOptions[option.id] || 0) + 1)}
                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {date && startTime && endTime && (
        <div className="mt-4">
          <p className="text-lg font-semibold">
            合計金額: ¥{calculateTotalPrice().toLocaleString()}
          </p>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? "..." : "予約する"}
      </button>
    </form>
  )
} 