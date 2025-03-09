import { useState } from 'react'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { ja } from 'date-fns/locale'

type Props = {
  onDateSelect: (date: Date | null) => void
  selectedDate: Date | null
}

export default function DateSelector({ onDateSelect, selectedDate }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const nextMonth = addMonths(currentMonth, 1)

  const generateMonthDays = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  const currentMonthDays = generateMonthDays(currentMonth)
  const nextMonthDays = generateMonthDays(nextMonth)

  const renderMonth = (days: Date[], monthDate: Date) => (
    <div className="w-1/2 px-2">
      <h3 className="text-center font-semibold mb-2">
        {format(monthDate, 'yyyy年M月', { locale: ja })}
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-600 py-1">
            {day}
          </div>
        ))}
        {days.map((date) => {
          const isSelected = selectedDate && 
            format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

          return (
            <button
              key={date.toString()}
              onClick={() => !isPast && onDateSelect(date)}
              disabled={isPast}
              className={`
                text-center py-1 rounded-md text-sm
                ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
            >
              {format(date, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="text-gray-600 hover:text-gray-800"
        >
          ←前月
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-600 hover:text-gray-800"
        >
          次月→
        </button>
      </div>
      <div className="flex">
        {renderMonth(currentMonthDays, currentMonth)}
        {renderMonth(nextMonthDays, nextMonth)}
      </div>
    </div>
  )
} 