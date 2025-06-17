import React from 'react'
import { Box } from '@mui/material'
import WelcomeBanner from '@/components/WelcomeBanner'

export default function Home() {
  return (
    <>
      <Box sx={{ padding: 3 }}>
        <WelcomeBanner />
      </Box>
    </>
  )
}
