"use client"

import { format, addDays } from "date-fns"
import { ja } from "date-fns/locale"

type AvailabilityStatus = "available" | "few" | "unavailable"

type AvailabilityIcon = {
  icon: string
  label: string
  className: string
}

const availabilityIcons: Record<AvailabilityStatus, AvailabilityIcon> = {
  available: { icon: "⭕️", label: "予約可能", className: "text-green-600" },
  few: { icon: "△", label: "残りわずか", className: "text-yellow-600" },
  unavailable: { icon: "✕", label: "予約不可", className: "text-red-600" },
}

type AvailabilityCalendarProps = {
  availability: Record<string, AvailabilityStatus>
}

export function AvailabilityCalendar({ availability }: AvailabilityCalendarProps) {
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-4">予約可能状況</h2>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-2 pb-2">
          {dates.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd")
            const status = availability[dateStr] || "unavailable"
            const { icon, label, className } = availabilityIcons[status]

            return (
              <div
                key={dateStr}
                className="flex flex-col items-center min-w-[60px] p-2 rounded border hover:bg-gray-50"
              >
                <p className="text-sm text-gray-600">
                  {format(date, "M/d")}
                </p>
                <p className="text-xs text-gray-500">
                  {format(date, "E", { locale: ja })}
                </p>
                <p
                  className={`text-lg font-bold ${className} mt-1`}
                  title={`${format(date, "M/d")} ${label}`}
                >
                  {icon}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-4 flex gap-4 justify-end text-sm">
        {Object.entries(availabilityIcons).map(([status, { icon, label, className }]) => (
          <div key={status} className="flex items-center gap-1">
            <span className={className}>{icon}</span>
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 