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

// 今日から14日分の日付を生成する関数
function generateDates() {
  const dates = []
  for (let i = 0; i < 14; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    date.setHours(0, 0, 0, 0)
    dates.push(date)
  }
  return dates
}

async function main() {
  try {
    // 既存のデータを削除
    await prisma.reservation.deleteMany()
    await prisma.review.deleteMany()
    await prisma.hourlyPrice.deleteMany()
    await prisma.roomAvailability.deleteMany()
    await prisma.timeSlot.deleteMany()
    await prisma.roomImage.deleteMany()
    await prisma.room.deleteMany()
    await prisma.user.deleteMany()

    console.log("Starting to create rooms...")

    // 日付の生成
    const dates = generateDates()

    // ルームデータの作成
    const rooms = [
      {
        name: "ポーカールーム東京",
        description: "東京の中心地にある本格的なポーカールーム",
        address: "東京都渋谷区渋谷1-1-1",
        latitude: 35.658034,
        longitude: 139.701636,
        image: "/images/rooms/room-01/main.jpg"
      },
      {
        name: "ポーカールーム横浜",
        description: "横浜駅から徒歩5分、アクセス抜群のポーカールーム",
        address: "神奈川県横浜市西区みなとみらい2-2-2",
        latitude: 35.4628,
        longitude: 139.6222,
        image: "/images/rooms/room-02/main.jpg"
      },
      {
        name: "ポーカールーム大阪",
        description: "大阪梅田の中心地にある本格的なポーカールーム",
        address: "大阪府大阪市北区大深町3-3-3",
        latitude: 34.7024,
        longitude: 135.4959,
        image: "/images/rooms/room-03/main.jpg"
      },
      {
        name: "ポーカールーム名古屋",
        description: "名古屋駅直結、初心者から上級者まで楽しめる空間",
        image: "/images/rooms/room-04/main.jpg",
        images: {
          create: [
            { url: '/images/rooms/room-04/sub-1.jpg', order: 1 },
            { url: '/images/rooms/room-04/sub-2.jpg', order: 2 },
            { url: '/images/rooms/room-04/sub-3.jpg', order: 3 },
            { url: '/images/rooms/room-04/sub-4.jpg', order: 4 }
          ]
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
          create: [
            { url: '/images/rooms/room-05/sub-1.jpg', order: 1 },
            { url: '/images/rooms/room-05/sub-2.jpg', order: 2 },
            { url: '/images/rooms/room-05/sub-3.jpg', order: 3 },
            { url: '/images/rooms/room-05/sub-4.jpg', order: 4 }
          ]
        },
        capacity: 12,
        pricePerHour: 1700,
        prefecture: "福岡県",
        city: "福岡市",
        address: "博多区博多駅5-5-5",
        latitude: 33.5902,
        longitude: 130.4017
      }
    ] as const

    for (const roomData of rooms) {
      // ルームの作成
      const room = await prisma.room.create({
        data: {
          name: roomData.name,
          description: roomData.description,
          address: roomData.address,
          latitude: roomData.latitude,
          longitude: roomData.longitude,
          image: roomData.image,
          pricePerHour: 'pricePerHour' in roomData ? roomData.pricePerHour : 2000,
          capacity: 'capacity' in roomData ? roomData.capacity : 8,
          prefecture: 'prefecture' in roomData ? roomData.prefecture : null,
          city: 'city' in roomData ? roomData.city : null
        }
      })
      console.log(`Created room: ${room.name}`)

      if (room.image) {
        // サブ画像の追加
        await prisma.roomImage.createMany({
          data: [
            { roomId: room.id, url: room.image.replace('main.jpg', 'sub-1.jpg'), order: 1 },
            { roomId: room.id, url: room.image.replace('main.jpg', 'sub-2.jpg'), order: 2 },
            { roomId: room.id, url: room.image.replace('main.jpg', 'sub-3.jpg'), order: 3 },
            { roomId: room.id, url: room.image.replace('main.jpg', 'sub-4.jpg'), order: 4 }
          ]
        })
      }

      // 時間ごとの料金設定
      const hourlyPrices = []
      for (let hour = 0; hour < 24; hour++) {
        hourlyPrices.push({
          roomId: room.id,
          hour,
          price: 2000, // 基本料金
        })
      }
      await prisma.hourlyPrice.createMany({
        data: hourlyPrices,
      })
      console.log(`Created ${hourlyPrices.length} hourly prices for ${room.name}`)

      // 各日付に対して予約可能時間を設定
      for (const date of dates) {
        // 予約可能状態を作成
        await prisma.roomAvailability.create({
          data: {
            roomId: room.id,
            date,
            isAvailable: true,
          },
        })
        console.log(`Created availability for ${room.name} on ${date.toISOString().split('T')[0]}`)

        // 30分単位の予約枠を作成
        const timeSlots = []
        for (let hour = 0; hour < 24; hour++) {
          for (let minute of [0, 30]) {
            timeSlots.push({
              roomId: room.id,
              date,
              hour,
              minute,
              isAvailable: true,
            })
          }
        }
        await prisma.timeSlot.createMany({
          data: timeSlots,
        })
        console.log(`Created time slots for ${room.name} on ${date.toISOString().split('T')[0]}`)
      }
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error:", error.message)
    } else {
      console.error("Error during seed:", error)
    }
    throw error
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 