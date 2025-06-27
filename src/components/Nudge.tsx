import React from 'react'
import { Box, Typography, useTheme, Paper } from '@mui/material'
import { useGuestContext } from '@/context/guestContext'
import { AccountCircle, CreditCard } from '@mui/icons-material'
import { JOURNEY_TYPES } from './textFields/constants'

const UserDetails: React.FC = () => {
  const theme = useTheme()
  const { Guest, isGuestLoggedIn, journeyType } = useGuestContext() // Get user data from context
  if (!isGuestLoggedIn || !Guest) {
    return null // If not logged in, return nothing
  }
  const nudgeData =
    journeyType === JOURNEY_TYPES?.TEGC_REDEMPTION
      ? {
          'Card Number': {
            value: Guest.cardNumber,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          'Card Type': {
            value: Guest.cardType,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          Balance: {
            value: Guest.balance,
            icon: <CreditCard sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
        }
      : journeyType === JOURNEY_TYPES?.NEUCOINS_REDEMPTION ||
        journeyType === JOURNEY_TYPES?.NEUCOINS_REINSTATE
      ? {
          'First Name': {
            value: Guest?.nameDetails?.firstName,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          'Last Name': {
            value: Guest?.nameDetails?.lastName,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          Balance: {
            value: Guest?.loyaltyInfo?.[0]?.loyaltyPoints,
            icon: <CreditCard sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
        }
      : journeyType === JOURNEY_TYPES?.VOUCHERS_REDEMPTION ||
        journeyType === JOURNEY_TYPES?.VOUCHERS_REINSTATE ||
        journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION
      ? {
          'Voucher Name': {
            value: Guest.productName,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          'Voucher Privilege Code': {
            value: Guest.privilegeCode,
            icon: <AccountCircle sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
          'Voucher Type': {
            value: Guest.label,
            icon: <CreditCard sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
          },
        }
      : {}

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 3,
        backgroundColor: theme.palette.primary.dark, // Match background to a darker shade for contrast
        borderRadius: '12px',
        boxShadow: theme.shadows[6],
        marginBottom: theme.spacing(3),
        overflow: 'hidden',
      }}
    >
      {/* Guest Details Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: 'white',
          textAlign: 'center',
          marginBottom: theme.spacing(2),
        }}
      >
        Guest Details
      </Typography>

      {/* Nudge Data */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {Object.entries(nudgeData).map(([key, { value, icon }], index) => (
          <Paper
            key={index}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 2,
              borderRadius: '8px',
              backgroundColor: theme.palette.background.paper, // Use background paper for contrast
              width: '30%',
              boxShadow: theme.shadows[3],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[6],
                backgroundColor: theme.palette.background.default, // Change color on hover
              },
            }}
          >
            {icon}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary, // Ensure text color is readable on background
                textAlign: 'center',
                marginTop: 1,
              }}
            >
              {key}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary, // Lighter text color for values
                fontWeight: 700,
                textAlign: 'center',
                marginTop: 0.5,
              }}
            >
              {value}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

export default UserDetails
