import React from 'react'
import MobileNumberInput from '@/components/textFields/MobileNumber'
import UserDetails from '@/components/Nudge'
import TabsComponent from '@/components/tabs'
import { useGuestContext } from '@/context/guestContext'
import { Box, Typography } from '@mui/material'
import VouchersTab from '../Redemption/VouchersList'
import { convertString } from '@/utils/pathtoHeadingConverter'

const VoucherReinstateAndTabs: React.FC = () => {
  const { isGuestLoggedIn, Guest, journeyType } = useGuestContext()
  return (
    <Box padding={'0 3vw'} alignContent={'center'}>
      {!isGuestLoggedIn ? (
        <MobileNumberInput />
      ) : isGuestLoggedIn && !Guest?.privilegeCode ? (
        <>
          <VouchersTab />
        </>
      ) : (
        <Box padding={'0 3vw'} textAlign={'center'}>
          <Typography
            variant="h2"
            sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
          >
            {convertString(journeyType)}
          </Typography>
          <TabsComponent />
        </Box>
      )}
    </Box>
  )
}

export default VoucherReinstateAndTabs
