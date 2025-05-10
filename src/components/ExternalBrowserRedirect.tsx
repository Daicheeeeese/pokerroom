'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isInAppBrowser, getExternalBrowserUrl } from '@/lib/utils'

function ExternalBrowserRedirectContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const userAgent = window.navigator.userAgent
    if (isInAppBrowser(userAgent)) {
      const currentUrl = window.location.href
      const externalUrl = getExternalBrowserUrl(currentUrl)
      window.location.href = externalUrl
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