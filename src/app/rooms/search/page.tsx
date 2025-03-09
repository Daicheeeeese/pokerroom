'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import RoomCard from '@/components/rooms/RoomCard'
import SearchBar from '@/components/SearchBar'
import { Room, Review } from '@prisma/client'

type RoomWithReviews = Room & {
  reviews: Review[]
}

export default function RoomSearchPage() {
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<RoomWithReviews[]>([])
  const [loading, setLoading] = useState(true)

  // 検索パラメータに基づいてルームを取得
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        
        // URLから検索パラメータを取得
        const area = searchParams.get('area')
        const date = searchParams.get('date')
        const guests = searchParams.get('guests')

        if (area) params.append('area', area)
        if (date) params.append('date', date)
        if (guests) params.append('guests', guests)

        const response = await fetch(`/api/rooms?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch rooms')
        }
        const data = await response.json()
        setRooms(data)
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [searchParams]) // searchParamsが変更されたら再取得

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              {rooms.length}件のルームが見つかりました
              {searchParams.get('area') && `（${searchParams.get('area')}）`}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selectedDate={searchParams.get('date') ? new Date(searchParams.get('date')!) : null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
} 