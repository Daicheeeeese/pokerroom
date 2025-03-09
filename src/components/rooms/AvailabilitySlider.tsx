'use client'

import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { type AvailabilityType } from './AvailabilityStatus'
import { useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type DayAvailability = {
  date: Date
  status: AvailabilityType
}

type Props = {
  availabilityData: DayAvailability[]
}

const statusColors = {
  '○': 'bg-green-100 text-green-800',
  '△': 'bg-yellow-100 text-yellow-800',
  '×': 'bg-red-100 text-red-800',
}

export default function AvailabilitySlider({ availabilityData }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return

    const scrollAmount = 200
    const newScrollLeft = direction === 'left'
      ? sliderRef.current.scrollLeft - scrollAmount
      : sliderRef.current.scrollLeft + scrollAmount

    sliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })

    // スクロールボタンの表示制御
    setTimeout(() => {
      if (!sliderRef.current) return
      setShowLeftButton(sliderRef.current.scrollLeft > 0)
      setShowRightButton(
        sliderRef.current.scrollLeft < 
        sliderRef.current.scrollWidth - sliderRef.current.clientWidth
      )
    }, 300)
  }

  return (
    <div className="relative">
      {/* 左スクロールボタン */}
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* スライダー本体 */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide gap-2 relative"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {availabilityData.map(({ date, status }) => (
          <div
            key={date.toISOString()}
            className="flex-shrink-0 text-center px-3 py-2"
          >
            <div className="text-sm text-gray-600">
              {format(date, 'M/d')}
              <span className="ml-1">
                ({format(date, 'E', { locale: ja })})
              </span>
            </div>
            <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
              {status}
            </div>
          </div>
        ))}
      </div>

      {/* 右スクロールボタン */}
      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  )
}

// スタイルをグローバルCSSに追加する必要があります
// @tailwind.css に以下を追加:
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }

export type { DayAvailability } 