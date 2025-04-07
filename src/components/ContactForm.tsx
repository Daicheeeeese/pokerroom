'use client'

import { useRouter } from 'next/navigation'

export default function ContactForm() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSfZcnGJORyG8Man8YZvcvS8HFu-PB1gr5EtzNFEJFiS0dSYtg/viewform?usp=header'
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">お問い合わせ</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600 mb-6">
          お問い合わせはGoogleフォームからお願いいたします。
        </p>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          お問い合わせフォームを開く
        </button>
      </div>
    </div>
  )
} 