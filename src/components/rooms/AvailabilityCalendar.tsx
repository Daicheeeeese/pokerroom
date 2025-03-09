"use client"

import { format, addDays, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"
import { type AvailabilityType } from './AvailabilityStatus'

type DayAvailability = {
  date: Date
  status: AvailabilityType
}

type Props = {
  availabilityData: DayAvailability[]
  onDateClick?: (date: Date) => void
  selectedDate?: Date
}

const statusColors = {
  '○': 'bg-green-100 text-green-800 hover:bg-green-200',
  '△': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  '×': 'bg-red-100 text-red-800 hover:bg-red-200',
}

const statusDescriptions = {
  '○': '予約可能',
  '△': '一部の時間のみ予約可能',
  '×': '予約不可',
}

export default function AvailabilityCalendar({ availabilityData, onDateClick, selectedDate }: Props) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">予約状況</h3>
        <div className="flex gap-4">
          {(Object.entries(statusDescriptions)).map(([status, description]) => (
            <div key={status} className="flex items-center text-sm">
              <span className={`inline-block w-6 h-6 rounded-full ${statusColors[status as AvailabilityType]} flex items-center justify-center mr-1`}>
                {status}
              </span>
              <span>{description}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {availabilityData.map(({ date, status }) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate)
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick?.(date)}
              className={`
                p-2 rounded-lg text-center transition-colors
                ${statusColors[status]}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="text-sm">{format(date, 'd')}</div>
              <div className="text-lg font-bold">{status}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 仮の予約状況を生成する関数（後でAPIから取得するように変更）
export function generateTwoWeeksAvailability() {
  const today = new Date()
  const twoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(today, i)
    const statuses: AvailabilityType[] = ['○', '△', '×']
    // 日曜日は営業していないものとする
    const status = date.getDay() === 0 
      ? '×' 
      : statuses[Math.floor(Math.random() * 3)]
    return { date, status }
  })
  return twoWeeks
}

export type { DayAvailability } 