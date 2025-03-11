"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function ReservationConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const roomId = searchParams.get("roomId")
  const roomName = searchParams.get("roomName")
  const date = searchParams.get("date")
  const startTime = searchParams.get("startTime")
  const endTime = searchParams.get("endTime")
  const totalPrice = searchParams.get("totalPrice")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      toast.error("ログインが必要です")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
        body: JSON.stringify({
          roomId,
          date,
          startTime,
          endTime,
          totalPrice: Number(totalPrice),
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "予約に失敗しました")
      }

      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      toast.success("予約を受け付けました。確認メールをお送りしましたので、ご確認ください。", {
        duration: 4500,
      })
      router.push("/reservations")
    } catch (error) {
      console.error("予約エラー:", error)
      toast.error(error instanceof Error ? error.message : "予約に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">予約内容の確認</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">予約詳細</h2>
          <dl className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <dt className="text-gray-600">ルーム</dt>
              <dd className="font-medium">{roomName}</dd>
            </div>
            <div className="flex justify-between py-2 border-b">
              <dt className="text-gray-600">日付</dt>
              <dd className="font-medium">{date}</dd>
            </div>
            <div className="flex justify-between py-2 border-b">
              <dt className="text-gray-600">時間</dt>
              <dd className="font-medium">{startTime} 〜 {endTime}</dd>
            </div>
            <div className="flex justify-between py-2 border-b">
              <dt className="text-gray-600">料金</dt>
              <dd className="font-medium">¥{Number(totalPrice).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? "予約処理中..." : "予約を確定する"}
          </button>
          <button
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full bg-gray-50 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-100"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
} 