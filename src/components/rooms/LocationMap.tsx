'use client'

import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type LocationMapProps = {
  latitude: number
  longitude: number
  address: string
}

// マーカーアイコンの設定
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  const position: [number, number] = useMemo(
    () => [latitude, longitude],
    [latitude, longitude]
  )

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">滞在エリア</h2>
      <div className="h-[400px] w-full relative rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {address}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">エリア情報</h3>
        <p className="text-gray-600">{address}</p>
      </div>
    </div>
  )
} 