// app/api/sanity/route.ts
import { NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity'
import type { NextRequest } from 'next/server'
import { getFeaturedVouchers } from '@/lib/queries'

// Define types for our data structure
export interface SanityArticle {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  categories?: string[]
  author?: {
    name: string
    image?: string
  }
}

interface SanityCacheData {
  cmsVouchers: SanityArticle[]
  updatedAt: string
}

// This ensures the route is not statically generated
export const dynamic = 'force-dynamic'

// Store cache in memory for this page only (not global)
let pageCache: {
  timestamp: number
  data: SanityCacheData
} | null = null

const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION
}

export async function GETVOUCHERS() {
  // Check for valid cache first
  if (pageCache && isCacheValid(pageCache.timestamp)) {
    return NextResponse.json({
      status: 'success',
      source: 'memory-cache',
      data: pageCache.data,
    })
  }

  try {
    // Fetch fresh data from Sanity

    const cmsVouchers = await sanityClient
      .fetch<SanityArticle | SanityArticle[]>(getFeaturedVouchers)
      .then((res) => (Array.isArray(res) ? res : [res]))

    const data: SanityCacheData = {
      cmsVouchers: cmsVouchers,
      updatedAt: new Date().toISOString(),
    }

    // Update in-memory cache
    pageCache = {
      timestamp: Date.now(),
      data,
    }

    return NextResponse.json({
      status: 'success',
      source: 'sanity-api',
      data,
    })
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch data from Sanity',
      },
      { status: 500 },
    )
  }
}
