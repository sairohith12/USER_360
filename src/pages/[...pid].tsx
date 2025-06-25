// pages/[...pid].tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Typography } from '@mui/material'
import { menuItems } from '@/config/menuItems'
import { GETVOUCHERS, SanityArticle } from 'api/sanity/route'

// Find the matching component for a given path
const findComponentForPath = (path: string) => {
  for (const item of menuItems) {
    // Check for main item paths
    if (item.path === path) {
      return item.Component
    }
    // Check for sub-item paths
    if (item.subItems) {
      const subItem = item.subItems.find((sub) => sub.path === path)
      if (subItem) {
        return subItem.Component
      }
    }
  }
  // If no match, return a default component (e.g., a 404 page or a placeholder)
  const NotFoundComponent = () => <Typography>Page Not Found</Typography>
  NotFoundComponent.displayName = 'NotFoundComponent'
  return NotFoundComponent
}
interface ApiResponse {
  status: 'success' | 'error'
  source?: 'memory-cache' | 'local-cache' | 'sanity-api'
  data?: {
    articles: SanityArticle[]
    categories: string[]
    authors: { name: string; id: string }[]
    updatedAt: string
  }
  message?: string
}

const DynamicPage: React.FC = () => {
  const router = useRouter()
  const { pid } = router.query
  const [data, setData] = useState<ApiResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'memory-cache' | 'local-cache' | 'sanity-api'>()
  const vouchersRoute = ['redemption/vouchers']
  // Ensure 'pid' is valid and handle path as a string
  const path = Array.isArray(pid) ? pid.join('/') : pid
  const ComponentToRender = findComponentForPath(`/${path}` || '/')

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      // First check client-side localStorage cache
      const cached = localStorage.getItem('sanity-special-page-cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (new Date().getTime() - parsed.timestamp < 24 * 60 * 60 * 1000) {
          setData(parsed.data)
          setSource('local-cache')
          setLoading(false)
          return
        }
      }
      // If no valid local cache, fetch from API
      const response = await GETVOUCHERS()
      const result: ApiResponse = await response.json()
      if (result.status === 'success' && result.data) {
        setData(result.data)
        setSource(result.source || 'sanity-api')

        // Update local cache
        localStorage.setItem(
          'sanity-special-page-cache',
          JSON.stringify({
            timestamp: Date.now(),
            data: result.data,
          }),
        )
      } else {
        throw new Error(result.message || 'Failed to fetch data')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Fetch error:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (path && vouchersRoute.includes(path)) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])
  return (
    <Box sx={{ padding: 3 }}>
      {ComponentToRender ? <ComponentToRender /> : <Typography>Page Not Found</Typography>}
    </Box>
  )
}

export default DynamicPage
