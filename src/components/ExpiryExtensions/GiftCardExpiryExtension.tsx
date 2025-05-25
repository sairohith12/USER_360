import React from 'react'
import GiftCardDetails from '@/components/textFields/GiftCardExpiryExtension'
import { Box } from '@mui/material'

const GiftCardExpiryExtension: React.FC = () => {
  return (
    <Box padding={'0 3vw'} alignContent={'center'}>
      <GiftCardDetails />
    </Box>
  )
}

export default GiftCardExpiryExtension
