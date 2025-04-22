'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function ReservationConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const date = searchParams.get('date')
  const startTime = searchParams.get('startTime')
  const endTime = searchParams.get('endTime')
  const numberOfPeople = searchParams.get('numberOfPeople')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

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
          numberOfPeople: parseInt(numberOfPeople || '1'),
        }),
      })

      if (!response.ok) {
        throw new Error('予約の作成に失敗しました')
      }

      const data = await response.json()
      router.push(`/reservations/${data.id}/complete`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '予約の作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!roomId || !date || !startTime || !endTime) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">エラー</h1>
        <Card className="p-6">
          <p className="text-red-600">必要な情報が不足しています</p>
        </Card>
      </div>
    )
  }

  const formattedDate = format(new Date(date), 'yyyy年MM月dd日', { locale: ja })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">予約内容の確認</h1>
      
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900">予約内容</h2>
            <div className="mt-2 space-y-2">
              <p>日付: {formattedDate}</p>
              <p>時間: {startTime} ~ {endTime}</p>
              <p>人数: {numberOfPeople}人</p>
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
            {isSubmitting ? '予約を確定中...' : '予約を確定'}
          </button>
        </form>
      </Card>
    </div>
  )
} 