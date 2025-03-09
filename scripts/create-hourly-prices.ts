import { prisma } from '../src/lib/prisma'

async function createHourlyPrices() {
  const room = await prisma.room.findUnique({
    where: { id: 'cm81a4nye0001vevdlx08ao2y' }
  });

  if (!room) {
    console.log('Room not found');
    return;
  }

  console.log('Creating hourly prices for room:', room.id);

  for (let hour = 0; hour < 24; hour++) {
    const price = hour >= 18 ? Math.floor(room.pricePerHour * 1.2) : room.pricePerHour;
    await prisma.hourlyPrice.create({
      data: {
        roomId: room.id,
        hour,
        price,
      }
    });
  }

  console.log('Hourly prices created');
  await prisma.$disconnect();
}

createHourlyPrices()
  .catch(console.error); 