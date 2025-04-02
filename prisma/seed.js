const { PrismaClient } = require('@prisma/client');
const { addDays, setHours, setMinutes } = require('date-fns');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Cloudinary URLを直接生成する関数
function generateImageUrl(roomNumber, type) {
  return `https://res.cloudinary.com/dxxeypyws/image/upload/v1741614032/main_ezdalc.jpg`;
}

async function main() {
  try {
    console.log("Checking existing data...");
    
    // テストユーザーの作成
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!existingUser) {
      console.log("Creating test user...");
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          name: 'テストユーザー',
          email: 'test@example.com',
          password: hashedPassword,
        },
      });
      console.log("Test user created successfully");
    } else {
      console.log("Test user already exists");
    }
    
    // ルームの存在確認
    const existingRooms = await prisma.room.findMany();
    
    if (existingRooms.length === 0) {
      console.log("Creating rooms...");
      // ルームの作成
      const rooms = await Promise.all([
        prisma.room.create({
          data: {
            id: 'room-tokyo',
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
          },
        }),
        prisma.room.create({
          data: {
            id: 'room-yokohama',
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
          },
        }),
        prisma.room.create({
          data: {
            id: 'room-osaka',
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
          },
        }),
        prisma.room.create({
          data: {
            id: 'room-nagoya',
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
          },
        }),
        prisma.room.create({
          data: {
            id: 'room-fukuoka',
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
          },
        }),
      ]);

      // 予約枠の作成
      console.log("Creating time slots...");
      const dates = generateDates();
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
          });
        }
      }
      console.log("Seed data created successfully");
    } else {
      console.log("Rooms already exist, skipping creation");
    }

  } catch (error) {
    console.error('Error during seed:', error);
    throw error;
  }
}

function generateDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(today, i);
    for (let hour = 10; hour <= 22; hour++) {
      dates.push(setHours(setMinutes(currentDate, 0), hour));
    }
  }

  return dates;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 