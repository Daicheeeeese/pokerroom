import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  try {
    const rooms = await prisma.room.findMany()
    console.log('Total rooms:', rooms.length)
    console.log('Rooms:', rooms.map(room => ({
      id: room.id,
      name: room.name,
      pricePerHour: room.pricePerHour,
      capacity: room.capacity
    })))
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 