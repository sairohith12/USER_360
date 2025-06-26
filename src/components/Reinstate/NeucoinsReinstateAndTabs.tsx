import React from 'react'
import MobileNumberInput from '@/components/textFields/MobileNumber'
import UserDetails from '@/components/Nudge'
import TabsComponent from '@/components/tabs'
import { useGuestContext } from '@/context/guestContext'
import { Box } from '@mui/material'

const NeucoinsReinstateAndTabs: React.FC = () => {
  const { isGuestLoggedIn } = useGuestContext()

  return (
    <Box
      sx={{
        px: { xs: 0, sm: '3vw' },
        alignContent: 'center',
      }}
    >
      {!isGuestLoggedIn ? (
        <MobileNumberInput />
      ) : (
        <>
          <UserDetails />
          <TabsComponent />
        </>
      )}
    </Box>
  )
}

export default NeucoinsReinstateAndTabs
