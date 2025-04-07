'use client'

import { useState } from 'react'

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'recommended', label: 'おすすめ順' },
  { value: 'priceAsc', label: '料金が安い順' },
  { value: 'priceDesc', label: '料金が高い順' },
]

type Props = {
  onSort: (value: string) => void
}

export default function SortOptions({ onSort }: Props) {
  const [selectedSort, setSelectedSort] = useState('recommended')

  const handleChange = (value: string) => {
    setSelectedSort(value)
    onSort(value)
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      <label htmlFor="sort" className="text-gray-700">
        並び替え:
      </label>
      <select
        id="sort"
        value={selectedSort}
        onChange={(e) => handleChange(e.target.value)}
        className="border rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
} 