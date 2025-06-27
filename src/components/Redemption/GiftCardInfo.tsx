import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
  useMediaQuery,
  Stack,
} from '@mui/material'
import React from 'react'
import { useTheme } from '@mui/material/styles'

// MUI Icons
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import EventIcon from '@mui/icons-material/Event'
import CategoryIcon from '@mui/icons-material/Category'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

interface GiftCardInfoProps {
  cardNumber: string
  balance: string
  cardType: string
  expiryDate: string
  status: 'Active' | 'Inactive' | 'Blocked' | 'Activated'
  isExpiryExtension: boolean
  onRedeem: () => void
}

const getStatusColor = (
  status: 'Active' | 'Inactive' | 'Blocked' | 'Activated',
): 'success' | 'warning' | 'error' | 'default' => {
  switch (status) {
    case 'Activated':
    case 'Active':
      return 'success'
    case 'Inactive':
      return 'warning'
    case 'Blocked':
      return 'error'
    default:
      return 'default'
  }
}

const GiftCardInfo: React.FC<GiftCardInfoProps> = ({
  cardNumber,
  balance,
  cardType,
  expiryDate,
  status,
  isExpiryExtension = false,
  onRedeem,
}) => {
  const isMobile = useMediaQuery('(max-width:480px)')
  const balanceValue = balance
  const isRedeemable = (status === 'Active' || status === 'Activated') && Number(balanceValue) > 0

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        p: 0,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        // '@media (max-width:480px)': {
        //   minWidth: '85vw',
        // },
      }}
    >
      {/* Info Grid */}
      <Grid container direction={isMobile ? 'column' : 'row'} alignItems="flex-start">
        <InfoItem label="Card Number" value={cardNumber} icon={<CreditCardIcon />} />
        {!isMobile && <Divider orientation="vertical" flexItem />}
        <InfoItem
          label="Balance"
          value={`₹ ${balance}`}
          highlight
          icon={<AccountBalanceWalletIcon />}
        />
        {!isMobile && <Divider orientation="vertical" flexItem />}
        <InfoItem label="Card Type" value={cardType} icon={<CategoryIcon />} />
        {!isMobile && <Divider orientation="vertical" flexItem />}
        <InfoItem label="Expiry Date" value={expiryDate} icon={<EventIcon />} />
        {!isMobile && <Divider orientation="vertical" flexItem />}
        <Grid>
          <Box p={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <VerifiedUserIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
            </Stack>
            <Chip
              label={status}
              color={getStatusColor(status)}
              sx={{ fontWeight: 500, px: 2, py: 0.5 }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider />

      {/* Bottom CTA Section */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" p={3} bgcolor="#f4f6fa">
        <Button
          variant="contained"
          disabled={!isRedeemable}
          onClick={onRedeem}
          sx={{
            backgroundColor: '#ff6f61',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#e65b50',
            },
            '&:disabled': {
              backgroundColor: '#ccc',
              color: '#666',
            },
          }}
        >
          {isExpiryExtension ? 'Extend Expiry' : 'Redeem'}
        </Button>
      </Box>
    </Paper>
  )
}

// Reusable InfoItem with icon
const InfoItem = ({
  label,
  value,
  highlight = false,
  icon,
}: {
  label: string
  value: string
  highlight?: boolean
  icon?: React.ReactNode
}) => (
  <Grid>
    <Box p={3}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        {icon}
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography
        variant={highlight ? 'h5' : 'h6'}
        sx={{
          fontWeight: 700,
          color: '#2e3b55',
          backgroundColor: highlight ? '#f0f4fa' : 'transparent',
          px: highlight ? 2 : 0,
          py: highlight ? 1 : 0,
          borderRadius: highlight ? 2 : 0,
          display: 'inline-block',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Grid>
)

export default GiftCardInfo
