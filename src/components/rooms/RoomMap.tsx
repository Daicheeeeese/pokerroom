'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface RoomMapProps {
  address: string
  latitude: number
  longitude: number
}

export function RoomMap({ address, latitude, longitude }: RoomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const initMap = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key is not configured')
        }

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['marker'],
        })

        const { Map } = await loader.importLibrary('maps')
        const { AdvancedMarkerElement } = await loader.importLibrary('marker')

        const position = {
          lat: latitude,
          lng: longitude,
        }

        const mapOptions = {
          center: position,
          zoom: 15,
          mapId: 'ROOM_MAP',
          disableDefaultUI: true,
        }

        const map = new Map(mapRef.current as HTMLDivElement, mapOptions)
        
        const marker = new AdvancedMarkerElement({
          position,
          map,
          title: address,
        })
      } catch (err) {
        console.error('Error initializing map:', err)
        if (err instanceof Error && err.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          setIsBlocked(true)
          setError('地図の表示がブロックされています。広告ブロッカーを無効にするか、セキュリティ設定を確認してください。')
        } else {
          setError('地図の読み込みに失敗しました。')
        }
      }
    }

    initMap()
  }, [address, latitude, longitude])

  if (error) {
    return (
      <div className="w-full h-[300px] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">{error}</p>
          {isBlocked && (
            <p className="text-sm text-gray-400">
              アドレス: {address}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 