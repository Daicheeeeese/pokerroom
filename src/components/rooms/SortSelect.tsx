'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type SortType = 'price_asc' | 'price_desc'

export default function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = (searchParams.get('sort') as SortType) || 'price_asc'

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href)
    url.searchParams.set('sort', e.target.value)
    router.push(url.toString())
  }

  return (
    <select
      className="border rounded-md px-2 py-1"
      value={currentSort}
      onChange={handleSortChange}
    >
      <option value="price_asc">料金が安い順</option>
      <option value="price_desc">料金が高い順</option>
    </select>
  )
} 