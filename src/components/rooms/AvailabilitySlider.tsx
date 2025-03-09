'use client'

import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"
import { useState, useRef, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type DayAvailability = {
  date: Date
  isAvailable: boolean
}

type Props = {
  availabilityData: DayAvailability[]
}

const statusColors: Record<'true' | 'false', string> = {
  'true': 'bg-green-100 text-green-800',
  'false': 'bg-gray-100 text-gray-400'
}

export default function AvailabilitySlider({ availabilityData }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      if (!sliderRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth)
    }

    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener('scroll', checkScroll)
      // 初期チェック
      checkScroll()

      // リサイズ時にもチェック
      window.addEventListener('resize', checkScroll)

      return () => {
        slider.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return

    const scrollAmount = 200 // スクロール量（ピクセル）
    const currentScroll = sliderRef.current.scrollLeft
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount

    sliderRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
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
        {availabilityData.map(({ date, isAvailable }) => (
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
            <div className={`mt-1 px-3 py-1 rounded-full text-sm font-medium ${statusColors[isAvailable ? 'true' : 'false']}`}>
              {isAvailable ? '○' : '×'}
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