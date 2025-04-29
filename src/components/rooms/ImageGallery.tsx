'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import './RoomCard.css'

interface RoomImage {
  id: string
  url: string
  caption?: string | null
}

interface Props {
  mainImage: string
  images: RoomImage[]
}

export default function ImageGallery({ mainImage, images }: Props) {
  const allImages = [mainImage, ...images.map(img => img.url)]

  return (
    <div className="relative h-[50vh] rounded-xl overflow-hidden">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full"
      >
        {allImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <Image
                src={image}
                alt={`画像 ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 