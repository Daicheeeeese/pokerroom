'use client'

import { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface RoomImage {
  id: string
  url: string
  caption?: string | null
}

interface Props {
  images: RoomImage[]
  mainImage: string
}

export default function ImageGallery({ images, mainImage }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const allImages = [{ id: 'main', url: mainImage }, ...images]

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const getCloudinaryId = (url: string) => {
    // Cloudinaryの画像URLからIDを抽出
    const matches = url.match(/\/v\d+\/(.+?)\./);
    return matches ? matches[1] : url;
  }

  return (
    <div>
      {/* メインギャラリーグリッド */}
      <div className="grid grid-cols-4 gap-2 h-[60vh]">
        <div className="col-span-2 row-span-2 relative rounded-l-xl overflow-hidden">
          <CldImage
            src={getCloudinaryId(mainImage)}
            alt="メイン画像"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => {
              setCurrentImageIndex(0)
              setIsOpen(true)
            }}
          />
        </div>
        {images.slice(0, 4).map((image, index) => (
          <div key={image.id} className="relative overflow-hidden">
            <CldImage
              src={getCloudinaryId(image.url)}
              alt={`部屋の画像 ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                setCurrentImageIndex(index + 1)
                setIsOpen(true)
              }}
            />
          </div>
        ))}
      </div>

      {/* フルスクリーンモーダル */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-6xl">
            <div className="relative aspect-video">
              <CldImage
                src={getCloudinaryId(allImages[currentImageIndex].url)}
                alt={`画像 ${currentImageIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              
              {/* ナビゲーションボタン */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>

              {/* 閉じるボタン */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 画像カウンター */}
            <div className="text-center text-white mt-4">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
} 