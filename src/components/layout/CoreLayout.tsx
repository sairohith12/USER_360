// components/layout/CoreLayout.tsx
import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Header from '@/components/Header'
import SidenavWithAccordions from '@/components/SidenavWithAccordions'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/router'
import { useGuestContext } from '@/context/guestContext'

interface Props {
  children: React.ReactNode
}

const drawerWidth = 340

const CoreLayout: React.FC<Props> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const { isGuestLoggedIn, guestLogout, journeyType } = useGuestContext()
  const router = useRouter()

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  useEffect(() => {
    if (!isLoggedIn && router.pathname !== '/login') {
      localStorage.clear()
      router.push('/login')
    }
    if (isGuestLoggedIn) {
      guestLogout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, router.pathname])

  useEffect(() => {
    guestLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyType])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <SidenavWithAccordions mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          overflowY: 'auto',
          bgcolor: 'background.default',
          p: { xs: 2, md: 3 },
          mt: (theme) => theme.spacing(22),
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, md: `${drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default CoreLayout
