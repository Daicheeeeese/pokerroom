import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    console.log("ミドルウェア - リクエスト:", {
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    })
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        console.log("ミドルウェア - 認証状態:", {
          url: req.url,
          hasToken: !!token,
          userId: token?.id,
          email: token?.email,
          token: token
        })
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // 予約リクエスト（ゲスト可）は除外
    // その他の予約関連ページのみ認証ガード
    "/reservations/(bookings|edit|[0-9a-zA-Z-]+|check|confirm|complete|history|cancel)/:path*",
    // APIは本当に認証が必要なものだけ指定（例: /api/reservations/history など）
    // "/api/reservations/history/:path*",
  ]
} 