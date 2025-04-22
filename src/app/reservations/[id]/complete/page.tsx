'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Link from 'next/link'

export default function ReservationCompletePage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">予約が完了しました</h1>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              予約の詳細はマイページから確認できます。
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                href="/mypage"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                マイページへ
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                トップページへ
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 