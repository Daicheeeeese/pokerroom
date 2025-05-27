'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Reservation } from '@prisma/client'

type Props = {
  reservation: Reservation & {
    room: {
      name: string
    }
    user?: {
      name: string | null
      email: string
    }
  }
}

export function ReservationDetail({ reservation }: Props) {
  const router = useRouter()
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    if (!confirm('予約をキャンセルしてもよろしいですか？')) {
      return
    }

    setIsCancelling(true)
    setError('')

    try {
      const response = await fetch(`/api/reservations/${reservation.id}/cancel`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('キャンセルに失敗しました')
      }

      router.refresh()
    } catch (error) {
      setError('キャンセルに失敗しました。もう一度お試しください。')
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">予約詳細</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/reservations/${reservation.id}/edit`)}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              編集
            </button>
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isCancelling ? 'キャンセル中...' : 'キャンセル'}
            </button>
          </div>
        </div>

        {/* 予約情報の表示 */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">予約情報</h2>
            <p>予約番号: {reservation.reservationCode}</p>
            <p>ステータス: {reservation.status}</p>
            <p>日付: {format(new Date(reservation.date), 'yyyy年MM月dd日', { locale: ja })}</p>
            <p>時間: {reservation.startTime} - {reservation.endTime}</p>
            <p>料金: ¥{reservation.totalPrice.toLocaleString()}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">お客様情報</h2>
            <p>名前: {reservation.guestName || reservation.user?.name}</p>
            <p>メール: {reservation.guestEmail || reservation.user?.email}</p>
            <p>電話: {reservation.guestPhone}</p>
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
} 