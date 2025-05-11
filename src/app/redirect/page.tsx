'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function RedirectPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const targetUrl = searchParams.get('url')
    if (!targetUrl) return

    const ua = navigator.userAgent.toLowerCase()
    const isLine = ua.includes('line')
    const isMessenger = ua.includes('fban')
    const isInstagram = ua.includes('instagram')
    const isTwitter = ua.includes('twitter')

    // SNSアプリ内ブラウザの場合
    if (isLine || isMessenger || isInstagram || isTwitter) {
      // iOSの場合
      if (/iphone|ipad|ipod/.test(ua)) {
        window.location.href = `googlechrome://${targetUrl.replace(/^https?:\/\//, '')}`
      } else {
        // Androidの場合
        window.location.href = `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`
      }
    } else {
      // 通常のブラウザの場合は直接遷移
      window.location.href = targetUrl
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-black">外部ブラウザに移動中...</h1>
      <p className="mb-4 text-black">SafariまたはChromeに自動で遷移します。</p>
      <p className="text-sm text-black">
        自動で遷移しない場合は、以下のリンクをタップしてください。
      </p>
      <a
        href={searchParams.get('url') || '/'}
        className="mt-4 text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        外部ブラウザで開く
      </a>
    </div>
  )
} 