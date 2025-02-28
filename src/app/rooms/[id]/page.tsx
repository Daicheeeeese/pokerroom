import Image from "next/image"
import Link from "next/link"
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationMap } from '@/components/rooms/LocationMap'
import { AvailabilityCalendar } from '@/components/rooms/AvailabilityCalendar'
import { format, addDays } from "date-fns"
import { ReviewSection } from "@/components/rooms/ReviewSection"
import { prisma } from "@/lib/prisma"
import { ReservationForm } from "@/components/rooms/ReservationForm"

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
      title: "ルームが見つかりません",
    }
  }

  return {
    title: room.name,
    description: room.description,
  }
}

export default async function RoomDetailPage({ params }: Props) {
  const room = await prisma.room.findUnique({
    where: {
      id: params.id,
    },
    include: {
      reviews: true,
    },
  })

  if (!room) {
    notFound()
  }

  const averageRating =
    room.reviews.length > 0
      ? room.reviews.reduce((acc, review) => acc + review.rating, 0) /
        room.reviews.length
      : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-96 mb-6">
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">{room.name}</h1>
          <p className="text-gray-600 mb-4">{room.description}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">基本情報</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">エリア:</span> {room.area}
              </p>
              <p>
                <span className="font-medium">住所:</span> {room.address}
              </p>
              <p>
                <span className="font-medium">料金:</span>{" "}
                ¥{room.price.toLocaleString()}/時間
              </p>
              <p>
                <span className="font-medium">定員:</span> {room.capacity}人
              </p>
              {averageRating && (
                <p className="flex items-center">
                  <span className="font-medium mr-2">評価:</span>
                  <span className="text-yellow-400">★</span>
                  <span>{averageRating.toFixed(1)}</span>
                </p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-3">設備・アメニティ</h2>
            <div className="flex flex-wrap gap-2">
              {room.facilities.map((facility) => (
                <span
                  key={facility}
                  className="bg-white px-3 py-1 rounded-full text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-2xl font-bold mb-6">予約</h2>
            <ReservationForm room={room} />
          </div>
        </div>
      </div>
    </div>
  )
} 