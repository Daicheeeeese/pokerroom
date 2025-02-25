import Image from "next/image"

// 仮のデータ
const room = {
  id: 1,
  name: "渋谷ポーカールーム",
  area: "渋谷",
  address: "東京都渋谷区渋谷1-1-1",
  price: 3000,
  capacity: 8,
  rating: 4.5,
  reviewCount: 32,
  facilities: ["tournament-chips", "food", "drink", "wifi"],
  description: `
    渋谷駅から徒歩5分の好立地にあるポーカールームです。
    トーナメントチップやタイマーなど、本格的な設備を完備しています。
    初心者から上級者まで、幅広いプレイヤーにご利用いただけます。
  `,
  images: [
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
    "https://placehold.co/800x600",
  ],
  amenities: [
    { name: "トーナメントチップ", description: "本格的なチップセットを完備" },
    { name: "Wi-Fi", description: "高速インターネット完備" },
    { name: "ドリンク", description: "ソフトドリンク飲み放題" },
    { name: "フード", description: "軽食メニューあり（有料）" },
  ],
}

type Props = {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function RoomPage({ params, searchParams }: Props) {
  // TODO: paramsのidを使用して実際のルームデータを取得する
  console.log(`Room ID: ${params.id}`);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー画像 */}
      <div className="relative h-[400px] bg-gray-900">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">{room.name}</h1>
            <p className="text-white/90 text-lg">{room.address}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報 */}
          <div className="lg:col-span-2">
            {/* 基本情報 */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">基本情報</h2>
              <p className="text-gray-600 whitespace-pre-line">{room.description}</p>
            </section>

            {/* 設備・アメニティ */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">設備・アメニティ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity.name}
                    className="flex items-start p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold mb-1">{amenity.name}</h3>
                      <p className="text-sm text-gray-600">
                        {amenity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 写真ギャラリー */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">写真</h2>
              <div className="grid grid-cols-2 gap-4">
                {room.images.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3]">
                    <Image
                      src={image}
                      alt={`${room.name}の写真 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-blue-600">
                  ¥{room.price.toLocaleString()}
                  <span className="text-sm font-normal text-gray-600">/時間</span>
                </p>
                <p className="text-gray-600 mt-2">最大{room.capacity}人</p>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xl">★</span>
                  <span className="ml-1 font-semibold">{room.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-600">{room.reviewCount}件の評価</span>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4">
                予約する
              </button>

              <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                お気に入りに追加
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 