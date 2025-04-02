'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import DateSelector from './DateSelector'

type SearchParams = {
  area: string
  date: Date | null
  guests: number
}

export default function SearchBar() {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    area: '',
    date: null,
    guests: 1
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchParams.area) params.append('area', searchParams.area)
    if (searchParams.date) params.append('date', searchParams.date.toISOString().split('T')[0])
    if (searchParams.guests > 1) params.append('guests', searchParams.guests.toString())
    
    router.push(`/rooms/search?${params.toString()}`)
    // 検索実行後に検索バーを閉じてパラメータをリセット
    setIsExpanded(false)
    setSearchParams({
      area: '',
      date: null,
      guests: 1
    })
  }

  // 検索バーの表示テキストを生成
  const getSearchBarText = () => {
    const parts = []
    if (searchParams.area) parts.push(searchParams.area)
    if (searchParams.date) parts.push(format(searchParams.date, 'M月d日(E)', { locale: ja }))
    if (searchParams.guests > 1) parts.push(`${searchParams.guests}人`)
    
    return parts.length > 0 ? parts.join(' · ') : 'どこでプレイする？'
  }

  return (
    <div className="relative z-40">
      {/* 非展開時の検索バー */}
      <div
        onClick={() => setIsExpanded(true)}
        className={`
          bg-white rounded-full shadow-md flex items-center justify-between
          border border-gray-200 cursor-pointer transition-all relative z-40
          ${isExpanded ? 'hidden' : 'block'}
        `}
      >
        <div className="flex items-center flex-1 px-6 py-3">
          <span className="text-gray-800">
            {getSearchBarText()}
          </span>
        </div>
      </div>

      {/* 展開時の検索フォーム */}
      <div className={`
        fixed md:top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl
        bg-white rounded-3xl shadow-lg z-40
        ${isExpanded ? 'block' : 'hidden'}
        ${isExpanded ? 'top-1/2 -translate-y-1/2 md:translate-y-0' : ''}
      `}>
        <div className="p-4">
          {/* エリア検索 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              エリア
            </label>
            <input
              type="text"
              placeholder="エリアを入力"
              value={searchParams.area}
              onChange={(e) => setSearchParams({ ...searchParams, area: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 日付選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日付
            </label>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {searchParams.date
                ? format(searchParams.date, 'yyyy年M月d日(E)', { locale: ja })
                : '日付を選択'}
            </button>
            {showDatePicker && (
              <div className="absolute left-0 right-0 mt-2 px-4">
                <DateSelector
                  selectedDate={searchParams.date}
                  onDateSelect={(date) => {
                    setSearchParams({ ...searchParams, date })
                    setShowDatePicker(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* 人数選択 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              人数
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setSearchParams(prev => ({
                  ...prev,
                  guests: Math.max(1, prev.guests - 1)
                }))}
                className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-4 py-1 border-t border-b border-gray-300">
                {searchParams.guests}人
              </span>
              <button
                onClick={() => setSearchParams(prev => ({
                  ...prev,
                  guests: Math.min(10, prev.guests + 1)
                }))}
                className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* 検索ボタン */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setIsExpanded(false)
                setSearchParams({
                  area: '',
                  date: null,
                  guests: 1
                })
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
            <button
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              検索
            </button>
          </div>
        </div>
      </div>

      {/* オーバーレイ */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => {
            setIsExpanded(false)
            setSearchParams({
              area: '',
              date: null,
              guests: 1
            })
          }}
        />
      )}
    </div>
  )
} 