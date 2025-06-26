import React from 'react'
import GiftCardDetails from '@/components/textFields/GiftCard'
import UserDetails from '@/components/Nudge'
import TabsComponent from '@/components/tabs'
import { useGuestContext } from '@/context/guestContext'
import { Box } from '@mui/material'

const GiftCardsRedemptionsAndTabs: React.FC = () => {
  const { isGuestLoggedIn } = useGuestContext()

  return (
    <Box
      sx={{
        px: { xs: 0, sm: '3vw' },
        alignContent: 'center',
      }}
    >
      {!isGuestLoggedIn ? (
        <GiftCardDetails />
      ) : (
        <>
          <UserDetails />
          <TabsComponent />
        </>
      )}
    </Box>
  )
}

export default GiftCardsRedemptionsAndTabs
