'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          エラーが発生しました
        </h1>
        <p className="text-gray-600 mb-8">
          申し訳ありませんが、予期せぬエラーが発生しました。
        </p>
        <button
          onClick={reset}
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </div>
  )
} 