export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          予約の確認
        </h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              予約を確認するには、ログインが必要です。
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ログインする
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 