'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isInAppBrowser, getExternalBrowserUrl } from '@/lib/utils'

function ExternalBrowserRedirectContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return

      const userAgent = window.navigator.userAgent
      if (isInAppBrowser(userAgent)) {
        const currentUrl = window.location.href
        const externalUrl = getExternalBrowserUrl(currentUrl)
        
        // リダイレクト前に少し遅延を入れる
        setTimeout(() => {
          window.location.href = externalUrl
        }, 100)
      }
    } catch (error) {
      console.error('External browser redirect error:', error)
    }
  }, [pathname, searchParams])

  return null
}

export default function ExternalBrowserRedirect() {
  return (
    <Suspense fallback={null}>
      <ExternalBrowserRedirectContent />
    </Suspense>
  )
} 