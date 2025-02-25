'use client'

import dynamic from 'next/dynamic'

type LocationMapProps = {
  latitude: number
  longitude: number
  address: string
}

// MapComponentを動的にインポート
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    loading: () => (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    ),
    ssr: false // サーバーサイドレンダリングを無効化
  }
)

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">滞在エリア</h2>
      <MapComponent
        latitude={latitude}
        longitude={longitude}
        address={address}
      />
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">エリア情報</h3>
        <p className="text-gray-600">{address}</p>
      </div>
    </div>
  )
} 