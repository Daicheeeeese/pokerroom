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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[60vh] rounded-xl overflow-hidden">
          {/* メイン画像（左側2x2） */}
          <div className="col-span-1 md:col-span-2 md:row-span-2 relative" onClick={() => setIsOpen(true)}>
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
              className="relative hidden md:block"
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

        {/* モバイル用のサブ画像スライダー */}
        <div className="md:hidden mt-2 overflow-x-auto flex gap-2 scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative flex-shrink-0 w-24 h-24"
              onClick={() => {
                setCurrentImageIndex(index + 1)
                setIsOpen(true)
              }}
            >
              <Image
                src={image.url}
                alt={image.caption || `画像 ${index + 1}`}
                fill
                className="object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* 全ての画像を見るボタン */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors"
        >
          全ての画像を見る
        </button>
      </div>

      {/* 画像モーダル */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
        <div className="relative w-full h-full flex items-center justify-center">
          <Dialog.Panel className="w-full h-full flex items-center justify-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <button
              onClick={showPreviousImage}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>

            <button
              onClick={showNextImage}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>

            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
              <Image
                src={allImages[currentImageIndex]}
                alt={`画像 ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
} 