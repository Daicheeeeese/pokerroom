'use client'

type Props = { roomId: string }

export function ReserveButton({ roomId }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.location.href = `/reservations/request?roomId=${roomId}`}
      className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
    >
      予約
    </button>
  )
} 