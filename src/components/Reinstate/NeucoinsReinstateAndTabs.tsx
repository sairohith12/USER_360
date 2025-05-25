import React from 'react'
import MobileNumberInput from '@/components/textFields/MobileNumber'
import UserDetails from '@/components/Nudge'
import TabsComponent from '@/components/tabs'
import { useGuestContext } from '@/context/guestContext'
import { Box, Typography } from '@mui/material'
import { convertString } from '@/utils/pathtoHeadingConverter'

const NeucoinsReinstateAndTabs: React.FC = () => {
  const { isGuestLoggedIn, journeyType } = useGuestContext()

  return (
    <Box padding={'0 3vw'} textAlign={'center'}>
      <>
        <Typography
          variant="h2"
          sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
        >
          {convertString(journeyType)}
        </Typography>
        <TabsComponent />
      </>
    </Box>
  )
}

export default NeucoinsReinstateAndTabs
