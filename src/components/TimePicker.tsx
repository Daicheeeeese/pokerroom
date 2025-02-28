"use client"

import { forwardRef } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
  className?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => 
  i.toString().padStart(2, "0") + ":00"
)

export const TimePicker = forwardRef<HTMLSelectElement, Props>(
  ({ value, onChange, className }, ref) => {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        ref={ref}
      >
        <option value="">時間を選択</option>
        {HOURS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    )
  }
) 