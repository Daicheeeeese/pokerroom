import { PrismaClient } from '@prisma/client'
import { neonConfig } from '@neondatabase/serverless'

// ローカル開発環境の場合の設定
if (process.env.NODE_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`
  neonConfig.useSecureWebSocket = false
  neonConfig.pipelineTLS = false
  neonConfig.pipelineConnect = false
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.NODE_ENV === "production"
        ? process.env.DIRECT_URL
        : process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 