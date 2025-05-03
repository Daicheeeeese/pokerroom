import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { RoomDetailSection } from '@/components/rooms/RoomDetailSection'
import ImageGallery from '@/components/rooms/ImageGallery'
import { notFound } from 'next/navigation'
import { RoomWithDetails } from '@/types/room'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  try {
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!room) {
      return {
        title: 'ルームが見つかりません',
        description: '指定されたルームは存在しません。'
      }
    }

    return {
      title: `${room.name} | PokerBase`,
      description: room.description || `${room.name}の詳細ページです。`
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'エラーが発生しました',
      description: 'データの取得中にエラーが発生しました。'
    }
  }
}

export default async function RoomPage({ params }: Props) {
  const { id } = params
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: String(id),
      },
      include: {
        reviews: true,
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        nearestStations: true,
        businessHours: true,
        options: true,
        tags: {
          include: {
            tag: true
          }
        },
        score: true
      }
    }) as RoomWithDetails | null

    if (!room) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <ImageGallery mainImage={room.images.length > 0 ? room.images[0].url : ''} images={room.images} />
          <div className="mt-6 mb-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{room.name}</h1>
                <p className="mt-2 text-gray-500 text-sm md:text-base">{room.description || ''}</p>
                {room.score && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-700">{room.score.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">(Google Map)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RoomDetailSection room={room} />
            </div>
            <div className="lg:col-span-1">
              {/* 予約フォームやその他の情報をここに配置 */}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching room details:', error)
    // エラーの種類に応じて適切なメッセージを表示
    const errorMessage = error instanceof Error 
      ? `データの取得中にエラーが発生しました: ${error.message}`
      : 'データの取得中にエラーが発生しました。しばらく時間をおいて再度お試しください。'

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {errorMessage}
          </div>
        </div>
      </div>
    )
  }
} 