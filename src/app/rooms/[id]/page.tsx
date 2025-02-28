import Image from "next/image"
import Link from "next/link"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationMap } from '@/components/rooms/LocationMap'
import { AvailabilityCalendar } from '@/components/rooms/AvailabilityCalendar'
import { format, addDays } from "date-fns"
import { ReviewSection } from "@/components/rooms/ReviewSection"
import { prisma } from "@/lib/prisma"

type Props = {
  params: {
    id: string
  }
}

// 仮の口コミデータ
const reviews = [
  {
    id: 1,
    userName: "田中さくら",
    userImage: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5.0,
    comment: "とても清潔で快適な空間でした。スタッフの方の対応も丁寧で、ポーカーを楽しむのに最適な環境が整っています。\n\nチップやカードも高品質で、本格的なゲームを楽しむことができました。また利用したいと思います！",
    date: "2024-03-01",
    location: "東京",
  },
  {
    id: 2,
    userName: "山田太郎",
    userImage: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.5,
    comment: "トーナメントで使用させていただきました。タイマーや設備が充実していて、スムーズに進行することができました。\n\n場所も駅から近く、アクセスが良いのも魅力です。",
    date: "2024-02-15",
    location: "神奈川",
  },
  {
    id: 3,
    userName: "鈴木美咲",
    userImage: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.8,
    comment: "初めてポーカールームを利用しましたが、スタッフの方が丁寧に説明してくださり、安心して遊ぶことができました。\n\n内装もおしゃれで、居心地の良い空間でした。友人たちと楽しい時間を過ごせました。",
    date: "2024-02-01",
    location: "千葉",
  },
  {
    id: 4,
    userName: "佐藤健一",
    userImage: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 4.7,
    comment: "定期的に利用していますが、いつも満足しています。Wi-Fiも安定していて、オンラインポーカーの配信なども問題なくできます。\n\nドリンクのサービスも充実していて、長時間の利用でも快適に過ごせます。",
    date: "2024-01-20",
    location: "埼玉",
  },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!room) {
    return {
      title: "ルームが見つかりません | PokerRoom",
      description: "お探しのルームは存在しないか、削除された可能性があります。",
    }
  }

  return {
    title: `${room.name} | PokerRoom`,
    description: room.description,
  }
}

export default async function RoomPage({ params }: Props) {
  try {
    console.log("Fetching room with ID:", params.id) // デバッグ用ログ

    const room = await prisma.room.findUnique({
      where: {
        id: params.id,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
      },
    })

    console.log("Found room:", room) // デバッグ用ログ

    if (!room) {
      console.log("Room not found") // デバッグ用ログ
      return notFound()
    }

    // 予約可能状況の生成（仮のデータ）
    const availability = Object.fromEntries(
      Array.from({ length: 14 }, (_, i) => {
        const date = addDays(new Date(), i)
        const status = ["available", "few", "unavailable"][
          Math.floor(Math.random() * 3)
        ] as "available" | "few" | "unavailable"
        return [format(date, "yyyy-MM-dd"), status]
      })
    )

    // アメニティデータの生成
    const amenities = room.facilities.map((facility) => ({
      name: facility,
      description: `${facility}を完備`,
    }))

    // 画像データの生成
    const images = [
      { src: room.imageUrl, alt: "メインルーム" },
      { src: "https://images.unsplash.com/photo-1596451190630-186aff535bf2?q=80&w=2574&auto=format&fit=crop", alt: "サブルーム" },
      { src: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?q=80&w=2574&auto=format&fit=crop", alt: "トーナメントエリア" },
      { src: "https://images.unsplash.com/photo-1505816014357-96b5ff457e9a?q=80&w=2574&auto=format&fit=crop", alt: "休憩スペース" },
    ]

    // 評価の平均を計算
    const rating = room.reviews.length > 0
      ? room.reviews.reduce((acc, review) => acc + review.rating, 0) / room.reviews.length
      : 0

    return (
      <div className="min-h-screen bg-gray-50">
        {/* ヘッダー画像 */}
        <div className="relative h-[400px] bg-gray-900">
          <Image
            src={room.imageUrl}
            alt={room.name}
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
              <AvailabilityCalendar availability={availability} />

              {/* 設備・アメニティ */}
              <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-4">設備・アメニティ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.map((amenity) => (
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
                  {images.map((image, index) => (
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

              {/* 口コミセクション */}
              <ReviewSection
                reviews={reviews}
                averageRating={rating}
                totalReviews={room.reviews.length}
              />
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
                    <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
                  </div>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-600">{room.reviews.length}件の評価</span>
                </div>

                <Link href={`/rooms/${room.id}/reserve`} className="block">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-4">
                    予約する
                  </button>
                </Link>

                <button className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  お気に入りに追加
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error(error)
    return notFound()
  }
} 