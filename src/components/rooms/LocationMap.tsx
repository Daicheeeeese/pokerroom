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
  const [debugInfo, setDebugInfo] = useState<string>('')
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  })

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

  // デバッグ情報
  useEffect(() => {
    const info = {
      env: process.env.NODE_ENV,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey.length,
      coords: { latitude, longitude },
      url: typeof window !== 'undefined' ? window.location.href : 'no window'
    }
    
    console.log('Debug info:', info)
    setDebugInfo(JSON.stringify(info, null, 2))
  }, [latitude, longitude, apiKey])

  // エラーハンドリング
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

  if (!apiKey) {
    return (
      <div className="h-[400px] bg-red-100 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">Google Maps APIキーが設定されていません</p>
        <pre className="text-xs bg-white p-4 rounded-lg overflow-auto max-w-full">
          {debugInfo}
        </pre>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="h-[400px] bg-gray-100 flex flex-col items-center justify-center p-4">
        <p className="text-red-600 mb-4">地図の読み込みに失敗しました</p>
        <pre className="text-xs bg-white p-4 rounded-lg overflow-auto max-w-full">
          {debugInfo}
          {'\n\nError details:\n' + JSON.stringify(loadError, null, 2)}
        </pre>
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