"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            PokerBase<span className="text-sm">(β版)</span>
          </Link>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/rooms/search"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              ルームを探す
            </Link>
            <Link
              href="/reservations"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              予約確認
            </Link>
            {!session ? (
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                ログイン
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <span>{session.user?.name}</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="flex items-center space-x-4 md:hidden">
            {!session ? (
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium"
              >
                ログイン
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {session.user?.name?.[0] || "U"}
              </div>
            )}
            <button 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">メニューを開く</span>
              {isMobileMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニューのオーバーレイ */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* モバイルナビゲーション */}
      <div
        className={`
          md:hidden fixed top-0 right-0 bottom-0 w-4/5 z-50 bg-white transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* 閉じるボタン */}
        <button
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="pt-20 px-4">
          <nav className="flex flex-col space-y-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 py-2 border-b border-gray-200 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <span className="text-gray-700">{session.user?.name}</span>
                </div>
                <Link
                  href="/rooms/search"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ルームを探す
                </Link>
                <Link
                  href="/reservations"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  予約確認
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium text-left"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/rooms/search"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ルームを探す
                </Link>
                <Link
                  href="/reservations"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  予約確認
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ログイン
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 