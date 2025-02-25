'use client'

import { useMemo, useEffect, useState } from 'react'
import { GoogleMap, useLoadScript, Libraries, Marker } from '@react-google-maps/api'

type LocationMapProps = {
  latitude: number
  longitude: number
  address: string
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const libraries: Libraries = ['places']

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  const [mounted, setMounted] = useState(false)

  // 基本的なマウント確認
  useEffect(() => {
    setMounted(true)
    // 基本的なデバッグ情報
    try {
      alert('Component mounted. Debug info: ' + 
        JSON.stringify({
          env: process.env.NODE_ENV,
          hasApiKey: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          coords: { latitude, longitude }
        }, null, 2)
      )
    } catch (error) {
      alert('Debug error: ' + error)
    }
  }, [latitude, longitude])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  // APIキーが存在しない場合の早期リターン
  if (!apiKey) {
    return (
      <div className="h-[400px] bg-red-100 flex items-center justify-center">
        <p className="text-red-600">Google Maps APIキーが設定されていません</p>
      </div>
    )
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  })

  useEffect(() => {
    if (loadError) {
      console.error('Detailed load error:', {
        error: loadError,
        message: loadError.message,
        type: loadError.name,
        stack: loadError.stack
      })
    }
  }, [loadError])

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  )

  const options = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      zoomControl: true,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
    }),
    []
  )

  if (loadError) {
    console.error('Map load error details:', {
      error: loadError,
      message: loadError.message,
      type: loadError.name
    })
    return (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">地図の読み込みに失敗しました</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="h-[400px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">滞在エリア</h2>
      <div className="h-[400px] w-full relative rounded-lg overflow-hidden border border-gray-200">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={center}
          options={options}
        >
          <Marker
            position={center}
            title={address}
          />
        </GoogleMap>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-2">エリア情報</h3>
        <p className="text-gray-600">{address}</p>
      </div>
    </div>
  )
} 