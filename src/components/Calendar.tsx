"use client"

import { useState } from "react"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns"
import { ja } from "date-fns/locale"

type Props = {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const isDateSelectable = (date: Date) => {
    return !isBefore(startOfDay(date), startOfDay(today))
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* カレンダーヘッダー */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, "yyyy年 M月", { locale: ja })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          →
        </button>
      </div>

      {/* 曜日の表示 */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付の表示 */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          const isCurrentMonth = isSameMonth(date, currentMonth)
          const isCurrentDay = isToday(date)
          const selectable = isDateSelectable(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => selectable && onDateSelect(date)}
              disabled={!selectable}
              className={`
                p-2 text-center rounded-lg
                ${!isCurrentMonth && "text-gray-300"}
                ${isSelected && "bg-blue-600 text-white"}
                ${isCurrentDay && !isSelected && "border border-blue-600"}
                ${
                  selectable
                    ? "hover:bg-gray-100"
                    : "cursor-not-allowed text-gray-300"
                }
              `}
            >
              {format(date, "d")}
            </button>
          )
        })}
      </div>
    </div>
  )
} 