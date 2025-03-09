'use client'

type LocationMapProps = {
  latitude: number
  longitude: number
  address: string
}

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">滞在エリア</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div>
          <h3 className="font-semibold mb-2">エリア情報</h3>
          <p className="text-gray-600">{address}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">アクセス</h3>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Google Mapsで見る
          </a>
        </div>
      </div>
    </div>
  )
} 