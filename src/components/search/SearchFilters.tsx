"use client"

import { useState } from "react"

const areas = ["渋谷", "新宿", "池袋", "銀座", "六本木", "赤坂", "上野", "秋葉原"]
const priceRanges = [
  { min: 0, max: 3000, label: "3,000円以下" },
  { min: 3000, max: 5000, label: "3,000円〜5,000円" },
  { min: 5000, max: 10000, label: "5,000円〜10,000円" },
  { min: 10000, max: null, label: "10,000円以上" },
]
const capacities = [
  { min: 2, max: 4, label: "2〜4人" },
  { min: 5, max: 8, label: "5〜8人" },
  { min: 9, max: 12, label: "9〜12人" },
  { min: 13, max: null, label: "13人以上" },
]
const facilities = [
  { id: "tournament-chips", label: "トーナメントチップ" },
  { id: "cash-chips", label: "キャッシュチップ" },
  { id: "timer", label: "トーナメントタイマー" },
  { id: "food", label: "フード提供" },
  { id: "drink", label: "ドリンク提供" },
  { id: "wifi", label: "Wi-Fi" },
]

export function SearchFilters() {
  const [selectedArea, setSelectedArea] = useState<string>("")
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [selectedCapacity, setSelectedCapacity] = useState<number | null>(null)
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])

  const handleFacilityChange = (facilityId: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {/* エリア */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">エリア</h3>
        <div className="space-y-2">
          {areas.map((area) => (
            <label key={area} className="flex items-center">
              <input
                type="radio"
                name="area"
                value={area}
                checked={selectedArea === area}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="mr-2"
              />
              {area}
            </label>
          ))}
        </div>
      </div>

      {/* 価格帯 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">価格帯（1時間あたり）</h3>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="price"
                value={index}
                checked={selectedPriceRange === index}
                onChange={() => setSelectedPriceRange(index)}
                className="mr-2"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* 収容人数 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">収容人数</h3>
        <div className="space-y-2">
          {capacities.map((capacity, index) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name="capacity"
                value={index}
                checked={selectedCapacity === index}
                onChange={() => setSelectedCapacity(index)}
                className="mr-2"
              />
              {capacity.label}
            </label>
          ))}
        </div>
      </div>

      {/* 設備 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">設備・サービス</h3>
        <div className="space-y-2">
          {facilities.map((facility) => (
            <label key={facility.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(facility.id)}
                onChange={() => handleFacilityChange(facility.id)}
                className="mr-2"
              />
              {facility.label}
            </label>
          ))}
        </div>
      </div>

      {/* 検索ボタン */}
      <button
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => {
          // TODO: 検索処理の実装
          console.log({
            selectedArea,
            selectedPriceRange,
            selectedCapacity,
            selectedFacilities,
          })
        }}
      >
        この条件で検索する
      </button>
    </div>
  )
} 