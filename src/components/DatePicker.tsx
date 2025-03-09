"use client"

import { forwardRef } from "react"
import ReactDatePicker from "react-datepicker"
import { ja } from "date-fns/locale"

type Props = {
  selected: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  placeholderText?: string
  className?: string
}

const DatePicker = forwardRef<ReactDatePicker, Props>(
  ({ selected, onChange, minDate, placeholderText, className }, ref) => {
    return (
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate}
        placeholderText={placeholderText}
        className={className}
        dateFormat="yyyy/MM/dd"
        locale={ja}
        ref={ref}
      />
    )
  }
)

DatePicker.displayName = "DatePicker"

export default DatePicker 