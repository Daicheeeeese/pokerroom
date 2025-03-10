import { v2 as cloudinary } from 'cloudinary'
import path from 'path'

// Cloudinaryの設定
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadImage(localPath: string, publicId: string) {
  try {
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: publicId,
      folder: 'rooms',
    })
    console.log(`Uploaded ${publicId}: ${result.secure_url}`)
    return result.secure_url
  } catch (error) {
    console.error(`Error uploading ${publicId}:`, error)
    throw error
  }
}

async function main() {
  try {
    // 各ルームの画像をアップロード
    for (let i = 1; i <= 5; i++) {
      const roomNumber = String(i).padStart(2, '0')
      
      // メイン画像のアップロード
      await uploadImage(
        path.join(process.cwd(), 'public', 'images', 'rooms', `room-${roomNumber}`, 'main.jpg'),
        `room-${roomNumber}/main`
      )

      // サブ画像のアップロード
      for (let j = 1; j <= 4; j++) {
        await uploadImage(
          path.join(process.cwd(), 'public', 'images', 'rooms', `room-${roomNumber}`, `sub-${j}.jpg`),
          `room-${roomNumber}/sub-${j}`
        )
      }
    }

    console.log('All images uploaded successfully!')
  } catch (error) {
    console.error('Error during upload:', error)
    process.exit(1)
  }
}

main() 