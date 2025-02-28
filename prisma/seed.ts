import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // ルームデータの作成
  const room1 = await prisma.room.create({
    data: {
      id: "1",
      name: "渋谷ポーカールーム",
      description: "渋谷駅から徒歩5分の好立地。トーナメントやキャッシュゲームに対応した本格的なポーカールームです。初心者から上級者まで楽しめる空間をご用意しています。",
      address: "東京都渋谷区渋谷1-1-1",
      area: "渋谷",
      price: 3000,
      capacity: 8,
      latitude: 35.658034,
      longitude: 139.701636,
      imageUrl: "/images/rooms/room-sample-01.jpg",
      facilities: ["Wi-Fi", "ドリンクバー", "トーナメントチップ", "エアコン"],
    },
  })

  const room2 = await prisma.room.create({
    data: {
      id: "2",
      name: "新宿ポーカールーム",
      description: "新宿駅東口から徒歩3分。24時間営業の本格ポーカールーム。プロ仕様のテーブルとチップを完備。上質な空間で思う存分ポーカーをお楽しみください。",
      address: "東京都新宿区新宿3-1-1",
      area: "新宿",
      price: 3500,
      capacity: 10,
      latitude: 35.690921,
      longitude: 139.700258,
      imageUrl: "/images/rooms/room-sample-02.jpg",
      facilities: ["Wi-Fi", "ドリンクバー", "トーナメントチップ", "エアコン", "喫煙室"],
    },
  })

  console.log({ room1, room2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 