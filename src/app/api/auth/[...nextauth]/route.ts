import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// テストユーザー情報
const TEST_USER = {
  id: "1",
  name: "テストユーザー",
  email: "test@example.com",
  password: "test1234" // 開発用の簡易的な設定
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("メールアドレスとパスワードを入力してください")
          }

          // テストユーザーの認証（開発用の簡易的な実装）
          if (credentials.email === TEST_USER.email && credentials.password === TEST_USER.password) {
            return {
              id: TEST_USER.id,
              email: TEST_USER.email,
              name: TEST_USER.name,
            }
          }

          throw new Error("メールアドレスまたはパスワードが正しくありません")
        } catch (error) {
          console.error("認証エラー:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  debug: true,
})

export { handler as GET, handler as POST } 