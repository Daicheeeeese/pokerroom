export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* ヘッダー画像のスケルトン */}
      <div className="relative h-[400px] bg-gray-300" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報のスケルトン */}
          <div className="lg:col-span-2">
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* サイドバーのスケルトン */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
                <div className="h-10 bg-gray-200 rounded w-full" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 