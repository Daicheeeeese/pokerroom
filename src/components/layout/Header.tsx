import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            PokerRoom
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/rooms/search"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              ルームを探す
            </Link>
            <Link
              href="/bookings"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              予約確認
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              ログイン
            </Link>
          </nav>

          <button className="md:hidden">
            <span className="sr-only">メニューを開く</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
} 