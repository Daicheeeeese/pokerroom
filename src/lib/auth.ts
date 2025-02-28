import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
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
          if (
            credentials.email === "test@example.com" &&
            credentials.password === "test1234"
          ) {
            return {
              id: "1",
              email: "test@example.com",
              name: "テストユーザー",
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
  debug: process.env.NODE_ENV === "development",
} 