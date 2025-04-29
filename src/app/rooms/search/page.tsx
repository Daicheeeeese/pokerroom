'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import RoomCard from '@/components/rooms/RoomCard'
import SearchBar from '@/components/SearchBar'
import SortSelect from '@/components/rooms/SortSelect'
import { Room, Review, Tag } from '@prisma/client'

type RoomWithReviews = Room & {
  reviews: Review[]
  tags: Tag[]
}

type PaginationData = {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export default function RoomSearchPage() {
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<RoomWithReviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastRoomElementRef = useRef<HTMLDivElement>(null)

  const fetchRooms = useCallback(async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      setError(null)
      
      const params = new URLSearchParams()
      const area = searchParams.get('area')
      const date = searchParams.get('date')
      const guests = searchParams.get('guests')

      if (area) params.append('area', area)
      if (date) params.append('date', date)
      if (guests) params.append('guests', guests)
      params.append('page', page.toString())

      console.log('Fetching rooms with params:', params.toString())
      const response = await fetch(`/api/rooms?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch rooms')
      }

      const data = await response.json()
      console.log('Received rooms:', data)

      if (page === 1) {
        setRooms(data.rooms)
      } else {
        setRooms(prevRooms => [...prevRooms, ...data.rooms])
      }
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch rooms')
    } finally {
      setLoading(false)
      setIsLoadingMore(false)
    }
  }, [searchParams])

  useEffect(() => {
    fetchRooms(1)
  }, [fetchRooms])

  // 無限スクロールの実装
  useEffect(() => {
    if (loading || isLoadingMore) return

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage) {
          fetchRooms(pagination.currentPage + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (lastRoomElementRef.current) {
      observer.current.observe(lastRoomElementRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loading, isLoadingMore, pagination, fetchRooms])

  // ルームの並び替え
  const sortedRooms = [...rooms].sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.pricePerHour - b.pricePerHour
      case 'priceDesc':
        return b.pricePerHour - a.pricePerHour
      case 'ratingDesc':
        const aRating = a.reviews.reduce((acc, review) => acc + review.rating, 0) / (a.reviews.length || 1)
        const bRating = b.reviews.reduce((acc, review) => acc + review.rating, 0) / (b.reviews.length || 1)
        return bRating - aRating
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto mb-8 mt-8">
        <SearchBar />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">読み込み中です...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">
              {pagination.totalCount}件のプライベートポーカールームが見つかりました
              {searchParams.get('area') && `（${searchParams.get('area')}）`}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">並び替え:</span>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRooms.map((room, index) => (
              <div
                key={room.id}
                ref={index === sortedRooms.length - 1 ? lastRoomElementRef : null}
              >
                <RoomCard
                  room={room}
                  selectedDate={searchParams.get('date') ? new Date(searchParams.get('date')!) : null}
                />
              </div>
            ))}
          </div>

          {isLoadingMore && (
            <div className="text-center py-4">
              <p className="text-gray-600">追加のルームを読み込み中...</p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 