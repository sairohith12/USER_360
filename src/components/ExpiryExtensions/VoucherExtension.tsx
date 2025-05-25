import React from 'react'
import MobileNumberInput from '@/components/textFields/MobileNumber'
import UserDetails from '@/components/Nudge'
import { useGuestContext } from '@/context/guestContext'
import { Box } from '@mui/material'
import VouchersTab from '../Redemption/VoucherRedemptionAndTabs'
import TabItemRoom from '../tabs/tabItemRoom'

const VoucherExtension: React.FC = () => {
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
          <TabItemRoom />
        </>
      )}
    </Box>
  )
}

export default VoucherExtension
