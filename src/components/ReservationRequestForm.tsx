'use client'

import { useState, useEffect } from 'react'

type RoomOption = {
  id: string
  name: string
  price: number | null
  unit: 'per_hour' | 'per_halfHour' | 'per_hour_person'
}

type RoomWithDetails = {
  id: string
  options?: RoomOption[] | null
}

interface Props {
  room: RoomWithDetails
}

export function ReservationRequestForm({ room }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // room.options が null/undefined の場合は空配列にフォールバック
  const options: RoomOption[] = room.options ?? []

  useEffect(() => {
    console.log('options:', options)
  }, [options])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // TODO: 予約リクエストの処理をここに実装
    setIsSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* オプションが存在する場合のみ表示 */}
        {options.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">オプション</h3>
            <div className="space-y-4">
              {options
                // undefined/null を取り除く
                .filter((opt): opt is RoomOption => Boolean(opt))
                .map((opt) => (
                  <div key={opt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{opt.name}</h4>
                      <p className="text-gray-600">
                        {opt.price != null
                          ? `${opt.price.toLocaleString()}円`
                          : '金額未設定'}
                        {opt.unit === 'per_hour' && '/時間'}
                        {opt.unit === 'per_halfHour' && '/30分'}
                        {opt.unit === 'per_hour_person' && '/時間/人'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? '送信中...' : '予約リクエストを送信'}
        </button>
      </form>
    </div>
  )
}
