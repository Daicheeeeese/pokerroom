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
    "/reservations/:path*",
    "/api/reservations/:path*",
  ]
} 