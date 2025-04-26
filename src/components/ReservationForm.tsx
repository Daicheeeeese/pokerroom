'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSession } from 'next-auth/react'

type Option = {
  id: string
  name: string
  description?: string | null
  price: number
  unit: string
}

type Room = {
  id: string
  name: string
  description: string
  address: string
  capacity: number
  pricePerHour: number
  options: Option[]
}

interface Props {
  room: Room
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
    const isoDate = date.toISOString().split('T')[0]
    const start = new Date(`${isoDate}T${startTime}`)
    const end = new Date(`${isoDate}T${endTime}`)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    let totalPrice = room.pricePerHour * diffHours

    // オプション料金の計算
    Object.entries(selectedOptions).forEach(([optionId, isSelected]) => {
      if (isSelected) {
        const opt = room.options.find(o => o.id === optionId)
        if (opt) {
          switch (opt.unit) {
            case 'booking':
              totalPrice += opt.price
              break
            case 'per_hour':
              totalPrice += opt.price * diffHours
              break
            case 'per_halfHour':
              totalPrice += opt.price * (diffHours * 2)
              break
            case 'per_hour_person':
              totalPrice += opt.price * diffHours * people
              break
            default:
              totalPrice += opt.price
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
      setError('利用日と利用時間を選択してください')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          date,
          startTime,
          endTime,
          people,
          options: Object.entries(selectedOptions)
            .filter(([, sel]) => sel)
            .map(([id]) => id),
        }),
      })
      if (!response.ok) throw new Error('予約の作成に失敗しました')
      const data = await response.json()
      setSuccessMessage('予約が完了しました')
      router.push(`/reservations/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予約の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeOptions: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 2; m++) {
      const hour = h.toString().padStart(2, '0')
      const minute = (m * 30).toString().padStart(2, '0')
      timeOptions.push(`${hour}:${minute}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 日付 */}
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

      {/* 開始時間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">開始時間</label>
        <select
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      {/* 終了時間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">終了時間</label>
        <select
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      {/* 人数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">人数</label>
        <input
          type="number"
          min={1}
          value={people}
          onChange={e => setPeople(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* オプション */}
      {room.options.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">オプション</label>
          <div className="mt-2 space-y-4">
            {room.options.map(opt => (
              <div key={opt.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`option-${opt.id}`}
                  checked={selectedOptions[opt.id] || false}
                  onChange={e => setSelectedOptions({
                    ...selectedOptions,
                    [opt.id]: e.target.checked,
                  })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`option-${opt.id}`} className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">{opt.name}</span>
                  {opt.description && (
                    <span className="block text-sm text-gray-500">{opt.description}</span>
                  )}
                  <span className="block text-sm text-gray-600">
                    {opt.price.toLocaleString()}円
                    {opt.unit === 'per_hour' && '/時間'}
                    {opt.unit === 'per_halfHour' && '/30分'}
                    {opt.unit === 'per_hour_person' && '/時間/人'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 合計金額 */}
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
