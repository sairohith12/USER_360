import React from 'react'
import GiftCardDetails from '@/components/textFields/GiftCardExpiryExtension'
import { Box } from '@mui/material'

const GiftCardExpiryExtension: React.FC = () => {
  return (
    <Box
      sx={{
        px: { xs: 0, sm: '3vw' },
        alignContent: 'center',
      }}
    >
      <GiftCardDetails />
    </Box>
  )
}

export default GiftCardExpiryExtension
