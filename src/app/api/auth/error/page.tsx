'use client'

import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '認証の設定に問題があります。管理者にお問い合わせください。'
      case 'AccessDenied':
        return 'アクセスが拒否されました。'
      case 'Verification':
        return '認証に失敗しました。もう一度お試しください。'
      default:
        return '認証中にエラーが発生しました。もう一度お試しください。'
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">認証エラー</h1>
      <Card className="p-6">
        <p className="text-red-600">{getErrorMessage(error)}</p>
        <div className="mt-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800"
          >
            トップページに戻る
          </a>
        </div>
      </Card>
    </div>
  )
} 