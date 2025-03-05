import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("認証開始:", { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log("認証エラー: メールアドレスまたはパスワードが未入力")
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log("認証処理:", {
            email: credentials.email,
            foundUser: user ? {
              id: user.id,
              email: user.email,
              name: user.name
            } : null
          })

          if (!user) {
            console.log("認証エラー: ユーザーが見つかりません")
            return null
          }

          if (user.password !== credentials.password) {
            console.log("認証エラー: パスワードが一致しません")
            return null
          }

          console.log("認証成功:", {
            id: user.id,
            email: user.email,
            name: user.name
          })

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
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
      console.log("JWTコールバック:", {
        token: {
          ...token,
          id: token.id,
          email: token.email,
          name: token.name
        },
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null
      })

      if (user) {
        // ユーザー情報を確実にトークンに設定
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.sub = user.id
      }

      return token
    },
    async session({ session, token }) {
      console.log("セッションコールバック:", {
        session: {
          ...session,
          user: session.user ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name
          } : null
        },
        token: {
          id: token.id,
          email: token.email,
          name: token.name
        }
      })

      if (session.user) {
        // トークンからユーザー情報を確実に設定
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }

      return session
    },
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error("認証エラー:", code, metadata)
    },
    warn(code) {
      console.warn("認証警告:", code)
    },
    debug(code, metadata) {
      console.log("認証デバッグ:", code, metadata)
    },
  },
} 