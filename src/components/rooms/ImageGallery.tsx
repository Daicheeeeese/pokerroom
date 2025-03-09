'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

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
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const allImages = [mainImage, ...images.map(img => img.url)]

  const showNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const showPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <>
      <div className="relative">
        {/* グリッドコンテナ */}
        <div className="grid grid-cols-4 gap-2 h-[60vh] rounded-xl overflow-hidden">
          {/* メイン画像（左側2x2） */}
          <div className="col-span-2 row-span-2 relative" onClick={() => setIsOpen(true)}>
            <Image
              src={mainImage}
              alt="メイン画像"
              fill
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              priority
            />
          </div>

          {/* サブ画像（右側2x2グリッド） */}
          {images.slice(0, 4).map((image, index) => (
            <div
              key={image.id}
              className="relative"
              onClick={() => {
                setCurrentImageIndex(index + 1)
                setIsOpen(true)
              }}
            >
              <Image
                src={image.url}
                alt={image.caption || `画像 ${index + 1}`}
                fill
                className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* 全ての画像を見るボタン */}
        {images.length > 4 && (
          <button
            onClick={() => setIsOpen(true)}
            className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            全ての写真を見る
          </button>
        )}
      </div>

      {/* フルスクリーンモーダル */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative w-full max-w-7xl mx-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800/50 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="relative h-[85vh] w-full">
              <Image
                src={allImages[currentImageIndex]}
                alt={`画像 ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={showPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800/50 rounded-full transition-colors"
                >
                  <ArrowRightIcon className="h-6 w-6" />
                </button>
              </>
            )}

            {/* 画像カウンター */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 