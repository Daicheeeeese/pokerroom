import { format } from "date-fns"
import Link from "next/link"
import { useState } from "react"

type Reservation = {
  id: string
  date: string
  startTime: string
  endTime: string
  room: {
    name: string
  }
  totalPrice: number
}

type ReservationListProps = {
  reservations: Reservation[]
}

export function ReservationList({ reservations }: ReservationListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  const handleCancelClick = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return

    try {
      const response = await fetch(`/api/reservations/${selectedReservation.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("予約のキャンセルに失敗しました")
      }

      // ページをリロードして予約一覧を更新
      window.location.reload()
    } catch (error) {
      console.error("予約キャンセルエラー:", error)
      alert("予約のキャンセルに失敗しました")
    } finally {
      setIsModalOpen(false)
      setSelectedReservation(null)
    }
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">予約はありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <Link
              href={`/reservations/${reservation.id}`}
              className="flex-1"
            >
              <h3 className="text-lg font-medium text-gray-900">
                {reservation.room.name}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(reservation.date), "yyyy年MM月dd日")} {reservation.startTime} - {reservation.endTime}
              </p>
              <p className="text-sm font-medium text-gray-900">
                ¥{reservation.totalPrice.toLocaleString()}
              </p>
            </Link>
            <button
              onClick={() => handleCancelClick(reservation)}
              className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              キャンセル
            </button>
          </div>
        </div>
      ))}

      {/* キャンセル確認モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              予約をキャンセルしますか？
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              この操作は取り消すことができません。
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setSelectedReservation(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                いいえ
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                はい
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 