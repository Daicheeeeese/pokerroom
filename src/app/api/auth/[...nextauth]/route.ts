import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// テストユーザー情報
const TEST_USER = {
  id: "1",
  name: "テストユーザー",
  email: "test@example.com",
  password: "test1234" // 開発用の簡易的な設定
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 