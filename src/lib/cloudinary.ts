import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export const uploadImage = async (imageUrl: string, folder: string = 'rooms') => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: 'auto',
    })
    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

// 実際のCloudinaryのURLに基づいてマッピング
const CLOUDINARY_IMAGE_MAP = {
  'room-01': 'v1741608435/main_pn4byl',
  'room-02': 'v1741608435/main_pn4byl', // 実際のURLに置き換えてください
  'room-03': 'v1741608435/main_pn4byl', // 実際のURLに置き換えてください
  'room-04': 'v1741608435/main_pn4byl', // 実際のURLに置き換えてください
  'room-05': 'v1741608435/main_pn4byl', // 実際のURLに置き換えてください
} as const

export const generateImageUrl = (roomNumber: number, imageType: 'main' | 'sub', subNumber?: number) => {
  const baseUrl = 'https://res.cloudinary.com/dxxeypyws/image/upload'
  return `${baseUrl}/v1741614032/main_ezdalc.jpg`
} 