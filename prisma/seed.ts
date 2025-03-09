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
      id: "test-user-1",
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

  const room3 = await prisma.room.create({
    data: {
      name: "池袋ポーカーハウス",
      description: "池袋駅西口から徒歩7分。初心者から上級者まで楽しめる、アットホームな雰囲気のポーカールーム。",
      image: "/images/rooms/room-sample-01.jpg",
      capacity: 10,
      pricePerHour: 4000,
    },
  })

  const room4 = await prisma.room.create({
    data: {
      name: "六本木ポーカークラブ",
      description: "六本木駅直結。高級感あふれる内装で、上質なポーカー体験を提供。VIPルームも完備。",
      image: "/images/rooms/room-sample-02.jpg",
      capacity: 16,
      pricePerHour: 8000,
    },
  })

  const room5 = await prisma.room.create({
    data: {
      name: "秋葉原ゲーミングスペース",
      description: "秋葉原駅から徒歩2分。eスポーツ施設を併設した新しいスタイルのポーカールーム。",
      image: "/images/rooms/room-sample-01.jpg",
      capacity: 14,
      pricePerHour: 4500,
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
      {
        rating: 5,
        comment: "高級感があり、とても良い雰囲気でした。",
        roomId: room4.id,
      },
      {
        rating: 4,
        comment: "初心者でも安心して遊べる環境です。",
        roomId: room3.id,
      },
      {
        rating: 5,
        comment: "最新の設備が整っていて素晴らしかったです。",
        roomId: room5.id,
      },
      {
        rating: 4,
        comment: "アクセスが良く、気軽に利用できます。",
        roomId: room3.id,
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