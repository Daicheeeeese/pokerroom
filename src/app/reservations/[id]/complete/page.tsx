'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function ReservationCompletePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">予約が完了いたしました</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              予約の詳細は予約メールよりご確認ください。
            </p>
          </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 