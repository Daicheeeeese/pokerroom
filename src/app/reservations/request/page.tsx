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
  options: Array<{
    option: Option
  }>
}

export default function ReservationRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  const [date, setDate] = useState<string>('')
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1)
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({})
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

  const handleOptionChange = (optionId: string, quantity: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: quantity,
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
      .filter(([_, quantity]) => quantity > 0)
      .map(([optionId, quantity]) => ({ optionId, quantity }))

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
                {room.options.map(({ option }) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{option.name}</p>
                      {option.description && (
                        <p className="text-sm text-gray-500">{option.description}</p>
                      )}
                      <p className="text-sm">¥{option.price.toLocaleString()}</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={selectedOptions[option.id] || 0}
                      onChange={(e) => handleOptionChange(option.id, parseInt(e.target.value))}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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