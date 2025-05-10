'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isInAppBrowser, getExternalBrowserUrl } from '@/lib/utils'

export default function ExternalBrowserRedirect() {
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