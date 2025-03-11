import { PrismaClient, Prisma } from '@prisma/client'
import { generateImageUrl } from '../src/lib/cloudinary'
import { addDays, addHours, setHours, setMinutes } from 'date-fns'

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
  try {
    // 既存のデータを削除
    console.log("Deleting existing data...")
    await prisma.reservation.deleteMany()
    await prisma.review.deleteMany()
    await prisma.hourlyPrice.deleteMany()
    await prisma.roomAvailability.deleteMany()
    await prisma.timeSlot.deleteMany()
    await prisma.roomImage.deleteMany()
    await prisma.room.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.user.deleteMany()

    console.log("Starting to create tags...")
    // タグの作成を修正
    const createdTags = await prisma.tag.createMany({
      data: [
        { name: '飲食持ち込み可' },
        { name: 'ディーラー可' },
        { name: '喫煙可' },
        { name: 'RFID' },
        { name: 'Wi-Fi完備' },
      ],
    })

    // 作成したタグを取得
    const tags = await prisma.tag.findMany()
    console.log("Created tags:", tags)

    console.log("Starting to create rooms...")

    // ルームの作成
    const rooms = await Promise.all([
      prisma.room.create({
        data: {
          name: 'ポーカールーム東京',
          description: '東京の中心地にある本格的なポーカールーム',
          pricePerHour: 1000,
          capacity: 9,
          image: generateImageUrl(1, 'main'),
          prefecture: '東京都',
          city: '渋谷区',
          address: '東京都渋谷区渋谷1-1-1',
          latitude: 35.658034,
          longitude: 139.701636,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      }),
      prisma.room.create({
        data: {
          name: 'ポーカールーム横浜',
          description: '横浜の海が見える開放的なポーカールーム',
          pricePerHour: 900,
          capacity: 9,
          image: generateImageUrl(2, 'main'),
          prefecture: '神奈川県',
          city: '横浜市',
          address: '神奈川県横浜市西区みなとみらい2-2-2',
          latitude: 35.4628,
          longitude: 139.6222,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      }),
      prisma.room.create({
        data: {
          name: 'ポーカールーム大阪',
          description: '大阪の繁華街にある活気のあるポーカールーム',
          pricePerHour: 950,
          capacity: 9,
          image: generateImageUrl(3, 'main'),
          prefecture: '大阪府',
          city: '大阪市',
          address: '大阪府大阪市北区大深町3-3-3',
          latitude: 34.7024,
          longitude: 135.4959,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      }),
      prisma.room.create({
        data: {
          name: 'ポーカールーム名古屋',
          description: '名古屋駅から徒歩5分の好立地なポーカールーム',
          pricePerHour: 850,
          capacity: 9,
          image: generateImageUrl(4, 'main'),
          prefecture: '愛知県',
          city: '名古屋市',
          address: '愛知県名古屋市中村区名駅4-4-4',
          latitude: 35.1709,
          longitude: 136.8815,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      }),
      prisma.room.create({
        data: {
          name: 'ポーカールーム福岡',
          description: '福岡の中心地にある快適なポーカールーム',
          pricePerHour: 800,
          capacity: 9,
          image: generateImageUrl(5, 'main'),
          prefecture: '福岡県',
          city: '福岡市',
          address: '福岡県福岡市博多区博多駅5-5-5',
          latitude: 33.5902,
          longitude: 130.4017,
          tags: {
            connect: tags.map(tag => ({ id: tag.id })),
          },
        },
      }),
    ])

    // 予約枠の作成
    const dates = generateDates()
    for (const room of rooms) {
      for (const date of dates) {
        await prisma.timeSlot.create({
          data: {
            roomId: room.id,
            date: date,
            hour: date.getHours(),
            minute: 0,
            isAvailable: true,
          },
        })
      }
    }

    console.log('Seed data created successfully')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message)
    } else {
      console.error('Error during seed:', error)
    }
    throw error
  }
}

function generateDates() {
  const dates: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(today, i)
    for (let hour = 10; hour <= 22; hour++) {
      dates.push(setHours(setMinutes(currentDate, 0), hour))
    }
  }

  return dates
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 