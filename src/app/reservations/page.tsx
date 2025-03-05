"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ReservationList from "@/components/ReservationList"

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

export default function ReservationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user?.id) {
      const fetchReservations = async () => {
        try {
          console.log("予約データ取得開始 - セッション情報:", {
            userId: session.user.id,
            email: session.user.email,
            status: status
          })
          
          const response = await fetch("/api/reservations", {
            credentials: "include",  // セッションCookieを含める
          })
          console.log("APIレスポンス:", response.status)
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "予約の取得に失敗しました")
          }
          
          const data = await response.json()
          console.log("取得した予約データ:", {
            count: data.length,
            reservations: data
          })
          
          setReservations(data)
        } catch (error) {
          console.error("予約取得エラー:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchReservations()
    }
  }, [session, status, router])

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4">読み込み中...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">マイ予約</h1>
      <ReservationList reservations={reservations} />
    </div>
  )
} 