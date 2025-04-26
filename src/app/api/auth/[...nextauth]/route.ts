import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: process.env.NEXTAUTH_URL + '/api/auth/callback/google'
        }
      }
    })
  ],
  pages: {
    error: '/api/auth/error',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          // ユーザーが存在するか確認
          const existingUser = await prisma.user.findUnique({
            where: { email: profile?.email }
          })

          // ユーザーが存在しない場合は作成
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: profile?.email!,
                name: profile?.name || 'ゲスト',
                password: '', // パスワードは不要だが必須フィールドなので空文字を設定
                image: profile?.image || null
              }
            })
          }

          return true
        } catch (error) {
          console.error('ユーザー作成エラー:', error)
          return false
        }
      }
      return false
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
