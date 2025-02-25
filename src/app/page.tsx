import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-6">
            プライベートポーカールームを
            <br />
            かんたんに予約
          </h1>
          <p className="text-xl mb-8">
            東京都内のポーカールームを検索・予約できるプラットフォーム
          </p>
          <Link
            href="/rooms/search"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            ルームを探す
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            PokerRoomの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">
                かんたん検索
              </h3>
              <p className="text-gray-600">
                条件を指定して、ぴったりのポーカールームを見つけることができます
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-3">
                オンライン予約
              </h3>
              <p className="text-gray-600">
                24時間いつでもスマートフォンから予約が可能です
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-3">
                充実の口コミ
              </h3>
              <p className="text-gray-600">
                実際に利用したユーザーの評価や口コミを参考にできます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 人気のエリアセクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            人気のエリア
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["渋谷", "新宿", "池袋", "銀座"].map((area) => (
              <Link
                key={area}
                href={`/rooms/search?area=${area}`}
                className="relative h-40 rounded-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{area}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
