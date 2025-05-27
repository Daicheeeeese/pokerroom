'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckReservationPage() {
  const router = useRouter()
  const [reservationCode, setReservationCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch(`/api/reservations/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationCode,
          email,
        }),
      })

      if (!response.ok) {
        throw new Error('予約が見つかりません')
      }

      const data = await response.json()
      router.push(`/reservations/${data.id}`)
    } catch (error) {
      setError('予約が見つかりませんでした。予約番号とメールアドレスを確認してください。')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">予約の確認</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              予約番号
            </label>
            <input
              type="text"
              value={reservationCode}
              onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            予約を確認
          </button>
        </form>
      </div>
    </div>
  )
} 