import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteIfExists(model: string, deleteFunction: () => Promise<any>) {
  try {
    await deleteFunction()
    console.log(`Deleted all records from ${model}`)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      console.log(`Table for ${model} does not exist yet, skipping deletion`)
    } else {
      throw error
    }
  }
}

async function main() {
  // 既存のデータを削除（依存関係の順序に従って削除）
  await deleteIfExists('Reservation', () => prisma.reservation.deleteMany())
  await deleteIfExists('Review', () => prisma.review.deleteMany())
  await deleteIfExists('HourlyPrice', () => prisma.hourlyPrice.deleteMany())
  await deleteIfExists('RoomAvailability', () => prisma.roomAvailability.deleteMany())
  await deleteIfExists('RoomImage', () => prisma.roomImage.deleteMany())
  await deleteIfExists('Room', () => prisma.room.deleteMany())
  await deleteIfExists('User', () => prisma.user.deleteMany())

  console.log('Starting to create rooms...')

  // ルームデータを作成
  const rooms = [
    {
      name: "ポーカールーム東京",
      description: "東京駅から徒歩5分、アクセス抜群のポーカールーム。初心者から上級者まで楽しめる空間です。",
      image: "/images/rooms/room-01/main.jpg",
      images: {
        create: [
          { url: '/images/rooms/room-01/sub-1.jpg', order: 1 },
          { url: '/images/rooms/room-01/sub-2.jpg', order: 2 },
          { url: '/images/rooms/room-01/sub-3.jpg', order: 3 },
          { url: '/images/rooms/room-01/sub-4.jpg', order: 4 }
        ]
      },
      capacity: 8,
      pricePerHour: 1000,
      address: "東京都千代田区丸の内1-1-1",
      prefecture: "東京都",
      city: "千代田区",
      latitude: 35.681236,
      longitude: 139.767125,
    },
    {
      name: "ポーカールーム横浜",
      description: "横浜駅から徒歩5分、アクセス抜群のポーカールーム",
      image: "/images/rooms/room-02/main.jpg",
      images: {
        create: []
      },
      capacity: 6,
      pricePerHour: 1800,
      prefecture: "神奈川県",
      city: "横浜市",
      address: "西区みなとみらい2-2-2",
      latitude: 35.4628,
      longitude: 139.6222
    },
    {
      name: "ポーカールーム大阪",
      description: "大阪梅田の中心地にある本格的なポーカールーム",
      image: "/images/rooms/room-03/main.jpg",
      images: {
        create: []
      },
      capacity: 10,
      pricePerHour: 2200,
      prefecture: "大阪府",
      city: "大阪市",
      address: "北区大深町3-3-3",
      latitude: 34.7024,
      longitude: 135.4959
    },
    {
      name: "ポーカールーム名古屋",
      description: "名古屋駅直結、初心者から上級者まで楽しめる空間",
      image: "/images/rooms/room-04/main.jpg",
      images: {
        create: []
      },
      capacity: 8,
      pricePerHour: 1900,
      prefecture: "愛知県",
      city: "名古屋市",
      address: "中村区名駅4-4-4",
      latitude: 35.1709,
      longitude: 136.8815
    },
    {
      name: "ポーカールーム福岡",
      description: "博多駅から徒歩圏内、九州最大級のポーカールーム",
      image: "/images/rooms/room-05/main.jpg",
      images: {
        create: []
      },
      capacity: 12,
      pricePerHour: 1700,
      prefecture: "福岡県",
      city: "福岡市",
      address: "博多区博多駅5-5-5",
      latitude: 33.5902,
      longitude: 130.4017
    }
  ]

  try {
    for (const roomData of rooms) {
      const room = await prisma.room.create({
        data: roomData
      })
      console.log('Created room:', room.name)
      
      // 時間帯別料金を設定
      const hourlyPrices = await Promise.all(
        Array.from({ length: 24 }, (_, hour) => {
          const price = hour >= 18 ? Math.floor(room.pricePerHour * 1.2) : room.pricePerHour
          return prisma.hourlyPrice.create({
            data: {
              roomId: room.id,
              hour,
              price,
            },
          })
        })
      )
      console.log(`Created ${hourlyPrices.length} hourly prices for ${room.name}`)
    }
    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error during seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 