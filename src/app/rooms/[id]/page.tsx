import Image from "next/image"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationMap } from '@/components/rooms/LocationMap'
import { AvailabilityCalendar } from '@/components/rooms/AvailabilityCalendar'
import { format, addDays } from "date-fns"

type Props = {
  params: {
    id: string
  }
}

// 仮のルームデータ
const room = {
  id: "1",
  name: "渋谷ポーカールーム",
  description: "渋谷駅から徒歩5分の好立地。トーナメントやキャッシュゲームに対応した本格的なポーカールームです。初心者から上級者まで楽しめる空間をご用意しています。",
  address: "東京都渋谷区渋谷1-1-1",
  price: 3000,
  capacity: 8,
  rating: 4.5,
  reviewCount: 32,
  latitude: 35.658034,
  longitude: 139.701636,
  amenities: [
    { name: "トーナメントチップ", description: "本格的なトーナメント用チップセット完備" },
    { name: "タイマー", description: "プロ仕様のトーナメントタイマー" },
    { name: "ドリンク", description: "ソフトドリンク飲み放題" },
    { name: "Wi-Fi", description: "高速Wi-Fi完備" },
  ],
  images: [
    { src: "/images/rooms/room-sample-01.jpg", alt: "メインルーム" },
    { src: "/images/rooms/room-sample-02.jpg", alt: "サブルーム" },
    { src: "/images/rooms/room-sample-01.jpg", alt: "トーナメントエリア" },
    { src: "/images/rooms/room-sample-02.jpg", alt: "休憩スペース" },
  ],
  availability: Object.fromEntries(
    Array.from({ length: 14 }, (_, i) => {
      const date = addDays(new Date(), i);
      const status = ["available", "few", "unavailable"][Math.floor(Math.random() * 3)] as "available" | "few" | "unavailable";
      return [format(date, "yyyy-MM-dd"), status];
    })
  ),
}

export async function generateMetadata({ params: _params }: Props): Promise<Metadata> {
  // TODO: 実際のルームデータを取得する
  return {
    title: `${room.name} | PokerRoom`,
    description: room.description,
  }
}

export default async function RoomPage({ params: _params }: Props) {
  try {
    // TODO: paramsのidを使用して実際のルームデータを取得する
    console.log(`Room ID: ${_params.id}`);
    
    if (!room) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー画像 */}
        <div className="relative h-[400px] bg-gray-900">
          <Image
            src={room.images[0].src}
            alt={room.images[0].alt}
            fill
            priority
            sizes="100vw"
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

              {/* 予約可能状況 */}
              <AvailabilityCalendar availability={room.availability} />

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
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* 地図 */}
              <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <LocationMap
                  latitude={room.latitude}
                  longitude={room.longitude}
                  address={room.address}
                />
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
  } catch (_error) {
    return notFound()
  }
} 