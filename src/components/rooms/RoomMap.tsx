'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface RoomMapProps {
  address: string
  latitude: number
  longitude: number
}

export function RoomMap({ address, latitude, longitude }: RoomMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      })

      const { Map } = await loader.importLibrary('maps')
      const { Marker } = await loader.importLibrary('marker')

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
      const marker = new Marker({
        position,
        map,
        title: address,
      })
    }

    initMap()
  }, [address, latitude, longitude])

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 