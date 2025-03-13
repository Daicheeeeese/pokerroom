import { PrismaClient } from '@prisma/client'
import { neonConfig } from '@neondatabase/serverless'

// 本番環境の設定
if (process.env.NODE_ENV === "production") {
  neonConfig.wsProxy = (host) => `${host}/v1`
  neonConfig.useSecureWebSocket = true
  neonConfig.pipelineTLS = true
  neonConfig.pipelineConnect = true
  neonConfig.connectionTimeoutMillis = 10000
  neonConfig.keepAlive = true
  neonConfig.keepAliveInitialDelayMillis = 10000
}

// ローカル開発環境の場合の設定
if (process.env.NODE_ENV === "development") {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`
  neonConfig.useSecureWebSocket = false
  neonConfig.pipelineTLS = false
  neonConfig.pipelineConnect = false
  neonConfig.webSocketConstructor = globalThis.WebSocket
}

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables')
  }

  const client = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // ルーム作成時に自動的に時間帯別料金を設定するミドルウェア
  client.$use(async (params, next) => {
    try {
      // 先にオリジナルの操作を実行
      const result = await next(params)

      // ルームが作成された場合
      if (params.model === 'Room' && params.action === 'create') {
        const room = result
        console.log('Creating hourly prices for room:', room.id)
        
        // 時間帯別料金を設定
        const hourlyPrices = await Promise.all(
          Array.from({ length: 24 }, (_, hour) => {
            const price = hour >= 18 ? Math.floor(room.pricePerHour * 1.2) : room.pricePerHour
            return client.hourlyPrice.create({
              data: {
                roomId: room.id,
                hour,
                price,
              },
            })
          })
        )
        console.log(`Created ${hourlyPrices.length} hourly prices`)
      }

      return result
    } catch (error) {
      console.error('Error in middleware:', error)
      throw error
    }
  })

  return client
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export { prisma }
export default prisma 