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
      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
} 