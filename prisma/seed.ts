import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 既存のデータを削除
  await prisma.reservation.deleteMany()
  await prisma.review.deleteMany()
  await prisma.room.deleteMany()
  await prisma.user.deleteMany()

  // テストユーザーを作成
  const testUser = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "test1234",
    },
  })

  // テストデータを追加
  const room1 = await prisma.room.create({
    data: {
      name: "渋谷ポーカールーム",
      description: "渋谷駅から徒歩5分の好立地。トーナメントやキャッシュゲームに対応した本格的なポーカールームです。",
      image: "/images/rooms/room-sample-01.jpg",
      capacity: 8,
      pricePerHour: 3000,
    },
  })

  const room2 = await prisma.room.create({
    data: {
      name: "新宿ポーカースペース",
      description: "新宿駅東口から徒歩3分。24時間営業の本格ポーカールーム。",
      image: "/images/rooms/room-sample-02.jpg",
      capacity: 12,
      pricePerHour: 5000,
    },
  })

  // レビューのデータを作成
  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: "とても清潔で快適な空間でした。",
        roomId: room1.id,
      },
      {
        rating: 4,
        comment: "スタッフの対応が丁寧でした。",
        roomId: room1.id,
      },
      {
        rating: 5,
        comment: "設備が充実していて満足です。",
        roomId: room2.id,
      },
    ],
  })

  console.log("シードデータを作成しました")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 