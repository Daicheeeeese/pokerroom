import Link from "next/link"
import { useSession } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">PokerBase</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/rooms/search"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ルームを探す
            </Link>
            {session ? (
              <Link
                href="/reservations"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                予約確認
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
} 