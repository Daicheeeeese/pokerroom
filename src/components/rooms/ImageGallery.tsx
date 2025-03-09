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
      <div className="relative h-[400px] bg-gray-100">
        <Image
          src={mainImage}
          alt="メイン画像"
          fill
          className="object-cover cursor-pointer"
          onClick={() => setIsOpen(true)}
          priority
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative h-24 bg-gray-100 cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index + 1)
                setIsOpen(true)
              }}
            >
              <Image
                src={image.url}
                alt={image.caption || `画像 ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="relative z-50 max-w-7xl mx-auto px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="relative h-[80vh] max-h-[80vh] w-full">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={showNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-gray-800 rounded-full"
              >
                <ArrowRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </Dialog>
    </>
  )
} 