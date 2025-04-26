"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReservationList } from "@/components/ReservationList"
import { ReservationStatus } from "@prisma/client"
import { Card } from "@/components/ui/card"

type Reservation = {
  id: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: ReservationStatus
  room: {
    name: string
  }
}

export default function ReservationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      const fetchReservations = async () => {
        try {
          const response = await fetch("/api/reservations", {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "予約の取得に失敗しました")
          }
          
          const data = await response.json()
          setReservations(data.reservations || [])
        } catch (error) {
          console.error("予約取得エラー:", error)
          setError(error instanceof Error ? error.message : "予約の取得に失敗しました")
        } finally {
          setIsLoading(false)
        }
      }

      fetchReservations()
    }
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">予約一覧</h1>
        <Card className="p-6">
          <p>読み込み中...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">予約一覧</h1>
        <Card className="p-6">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">予約一覧</h1>
      {reservations.length === 0 ? (
        <Card className="p-6">
          <p>予約がありません</p>
        </Card>
      ) : (
        <ReservationList reservations={reservations} />
      )}
    </div>
  )
} 