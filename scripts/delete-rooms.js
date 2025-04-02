const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteRooms() {
  try {
    // 関連テーブルを先に削除
    await prisma.reservation.deleteMany();
    await prisma.roomImage.deleteMany();
    await prisma.review.deleteMany();
    await prisma.hourlyPriceWeekday.deleteMany();
    await prisma.hourlyPriceHoliday.deleteMany();

    // ルームを削除
    const result = await prisma.room.deleteMany();
    console.log(`Deleted ${result.count} rooms`);
  } catch (error) {
    console.error('Error deleting rooms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteRooms(); 