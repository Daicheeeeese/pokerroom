'use client'

import { useState } from "react"

export default function ClientSearchFilters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [capacity, setCapacity] = useState<number>(0)

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">検索条件</h2>

      {/* 価格帯 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          価格帯（1時間あたり）
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min="0"
            max="10000"
            step="1000"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-24 px-2 py-1 border rounded"
          />
          <span>〜</span>
          <input
            type="number"
            min="0"
            max="10000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-24 px-2 py-1 border rounded"
          />
          <span>円</span>
        </div>
      </div>

      {/* 収容人数 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          収容人数
        </label>
        <select
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="w-full px-2 py-1 border rounded"
        >
          <option value="0">指定なし</option>
          <option value="4">4人以上</option>
          <option value="6">6人以上</option>
          <option value="8">8人以上</option>
          <option value="10">10人以上</option>
        </select>
      </div>

      {/* 検索ボタン */}
      <button
        onClick={() => {
          // TODO: 検索処理を実装
          console.log({ priceRange, capacity })
        }}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        検索する
      </button>
    </div>
  )
} 