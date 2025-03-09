import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 既存のデータを削除（依存関係の順序に従って削除）
  await prisma.reservation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.hourlyPrice.deleteMany()
  await prisma.roomAvailability.deleteMany()
  await prisma.room.deleteMany()
  await prisma.user.deleteMany()

  // ルームデータを作成
  const rooms = [
    {
      name: "ポーカールーム東京",
      description: "東京都心の便利な場所にある快適なポーカールーム",
      image: "/images/room1.jpg",
      capacity: 8,
      pricePerHour: 2000,
      prefecture: "東京都",
      city: "渋谷区",
      address: "渋谷1-1-1",
      latitude: 35.6581,
      longitude: 139.7017
    },
    {
      name: "ポーカールーム横浜",
      description: "横浜駅から徒歩5分、アクセス抜群のポーカールーム",
      image: "/images/room2.jpg",
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
      image: "/images/room3.jpg",
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
      image: "/images/room4.jpg",
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
      image: "/images/room5.jpg",
      capacity: 12,
      pricePerHour: 1700,
      prefecture: "福岡県",
      city: "福岡市",
      address: "博多区博多駅5-5-5",
      latitude: 33.5902,
      longitude: 130.4017
    }
  ]

  for (const roomData of rooms) {
    const room = await prisma.room.create({
      data: roomData
    })
    console.log('Creating hourly prices for room:', room.id)
    
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
    console.log(`Created ${hourlyPrices.length} hourly prices`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 