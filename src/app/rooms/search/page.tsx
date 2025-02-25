import { SearchFilters } from "@/components/search/SearchFilters"
import { RoomList } from "@/components/rooms/RoomList"

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">ポーカールームを探す</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* フィルターサイドバー */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* 検索結果 */}
        <div className="lg:col-span-3">
          <RoomList />
        </div>
      </div>
    </div>
  )
} 