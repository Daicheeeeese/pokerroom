import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    const rooms = await prisma.room.findMany()
    console.log('=== Room Count ===')
    console.log(`Total rooms: ${rooms.length}`)
    console.log('\n=== Room Details ===')
    rooms.forEach(room => {
      console.log(`\nID: ${room.id}`)
      console.log(`Name: ${room.name}`)
      console.log(`Price: ${room.pricePerHour}`)
      console.log(`Capacity: ${room.capacity}`)
      console.log(`Image: ${room.image}`)
      console.log('---')
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 