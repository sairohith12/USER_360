import React from 'react'
import MobileNumberInput from '@/components/textFields/MobileNumber'
import UserDetails from '@/components/Nudge'
import TabsComponent from '@/components/tabs'
import { useGuestContext } from '@/context/guestContext'
import { Box } from '@mui/material'
import VouchersTab from '../Redemption/VouchersList'

const VoucherReinstateAndTabs: React.FC = () => {
  const { isGuestLoggedIn, Guest } = useGuestContext()
  return (
    <Box padding={'0 3vw'} alignContent={'center'}>
      {!isGuestLoggedIn ? (
        <MobileNumberInput />
      ) : isGuestLoggedIn && !Guest?.privilegeCode ? (
        <>
          <VouchersTab />
        </>
      ) : (
        <>
          <UserDetails />
          <TabsComponent />
        </>
      )}
    </Box>
  )
}

export default VoucherReinstateAndTabs
