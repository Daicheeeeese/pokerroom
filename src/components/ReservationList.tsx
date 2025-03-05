import { format } from "date-fns"
import Link from "next/link"

type Reservation = {
  id: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  room: {
    name: string
  }
}

type Props = {
  reservations: Reservation[]
}

export default function ReservationList({ reservations }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">予約一覧</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500">予約はありません</p>
      ) : (
        <div className="grid gap-4">
          {reservations.map((reservation) => (
            <Link
              key={reservation.id}
              href={`/reservations/${reservation.id}`}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reservation.room.name}</h3>
                  <p className="text-gray-600">
                    {format(new Date(reservation.date), "yyyy年MM月dd日")}
                  </p>
                  <p className="text-gray-600">
                    {reservation.startTime} 〜 {reservation.endTime}
                  </p>
                </div>
                <p className="font-semibold">
                  ¥{reservation.totalPrice.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 