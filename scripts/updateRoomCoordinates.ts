import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as dotenv from 'dotenv'

// .envファイルを読み込む
dotenv.config()

const prisma = new PrismaClient()

async function getCoordinates(address: string) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location
      return { latitude: lat, longitude: lng }
    }
    return { latitude: 35.6812362, longitude: 139.7671248 } // デフォルト値：東京駅
  } catch (error) {
    console.error('Error getting coordinates:', error)
    return { latitude: 35.6812362, longitude: 139.7671248 } // エラー時もデフォルト値を返す
  }
}

async function updateRoomCoordinates() {
  const rooms = await prisma.room.findMany()

  for (const room of rooms) {
    const coordinates = await getCoordinates(room.address)
    try {
      await prisma.room.update({
        where: { id: room.id },
        data: coordinates,
      })
      console.log(`Updated coordinates for room: ${room.name}`)
    } catch (error) {
      console.error(`Failed to update coordinates for room: ${room.name}`, error)
    }
  }
}

updateRoomCoordinates()
  .catch((error) => {
    console.error('Error:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 