import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ページが見つかりません
        </h1>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
} 