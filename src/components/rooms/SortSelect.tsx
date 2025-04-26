'use client'

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'recommended', label: 'おすすめ順' },
  { value: 'priceAsc', label: '料金が安い順' },
  { value: 'priceDesc', label: '料金が高い順' },
  { value: 'newest', label: '新着順' }
]

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function SortSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
} 