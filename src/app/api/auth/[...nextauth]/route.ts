import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// テストユーザー情報
const TEST_USER = {
  id: "1",
  name: "テストユーザー",
  email: "test@example.com",
  // パスワード: "test1234" をハッシュ化した値
  password: "$2a$12$9VVeQKS9Pw9D7NQfGAYwPeQH5oFHb7omXRKVHzJX.J4GUlPYr1Rey"
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください")
        }

        // テストユーザーの認証
        if (credentials.email !== TEST_USER.email) {
          throw new Error("メールアドレスまたはパスワードが正しくありません")
        }

        const isValid = await compare(credentials.password, TEST_USER.password)

        if (!isValid) {
          throw new Error("メールアドレスまたはパスワードが正しくありません")
        }

        return {
          id: TEST_USER.id,
          email: TEST_USER.email,
          name: TEST_USER.name,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
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
})

export { handler as GET, handler as POST } 