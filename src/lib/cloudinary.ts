import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.pokerroom,
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

export const generateImageUrl = (roomNumber: number, imageType: 'main' | 'sub', subNumber?: number) => {
  const baseUrl = 'https://res.cloudinary.com/' + process.env.CLOUDINARY_CLOUD_NAME + '/image/upload'
  const imagePath = subNumber 
    ? `/rooms/room-${String(roomNumber).padStart(2, '0')}/sub-${subNumber}.jpg`
    : `/rooms/room-${String(roomNumber).padStart(2, '0')}/main.jpg`
  return baseUrl + imagePath
} 