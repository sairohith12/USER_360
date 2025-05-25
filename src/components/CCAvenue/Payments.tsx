import React, { useState } from 'react'
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Tooltip,
  ButtonGroup,
  Grid,
  Paper,
  MenuItem,
} from '@mui/material'
// import { CreditCard, Hotel, RefreshCw } from 'lucide-react'
import CombinedModal from '@/components/modal/ReponseModal'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ApartmentIcon from '@mui/icons-material/Apartment'
import OrderStatus from './OrderStatus'
import TabItemRoom from '../tabs/tabItemRoom'
import { convertString } from '@/utils/pathtoHeadingConverter'
import { useGuestContext } from '@/context/guestContext'

const PaymentJourney = () => {
  const [mainTab, setMainTab] = useState('payOnline')
  const [subTab, setSubTab] = useState('generatePayment')
  const [mobile, setMobile] = useState('')
  const [amount, setAmount] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const [reference, setReference] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [fetchedData, setFetchedData] = useState<{
    guest: string
    amount: number
    status: string
    refId: string
  } | null>(null)
  const [status, setStatus] = useState('pending')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundType, setRefundType] = useState('full')
  const [reason, setReason] = useState('')
  const [remarks, setRemarks] = useState('')
  const { journeyType } = useGuestContext()
  const handleGenerate = () => {
    setModalOpen(true)
  }

  const handleFetch = () => {
    setFetchedData({
      guest: 'John Doe',
      amount: 1200,
      status: 'success',
      refId: reference,
    })
    setStatus('success')
  }

  const renderSubContent = () => {
    switch (subTab) {
      //   case 'orderLookup':
      //     return <Typography variant="body1">Enter Order ID to Lookup.</Typography>
      case 'orderStatus':
        return <OrderStatus />
      case 'generatePayment':
        return (
          <Box mt={2}>
            <TabItemRoom />
          </Box>
        )
      default:
        return null
    }
  }
  //   const renderMainTab = () => (
  //     <Box>

  //     </Box>
  //   )
  const renderMainTab = () => (
    <Box>
      {/* <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontSize: '1.1rem',
            padding: '16px 24px',
            minHeight: '56px',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#f4f6fa',
            },
          },
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
       
        <Tab label="Generate Payment" value="generatePayment" />
        <Tab label="Order Status" value="orderStatus" />
      </Tabs> */}
      {/* <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          mb: 3,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'space-between',
          },
          '& .MuiTab-root': {
            fontSize: '1.1rem',
            padding: '16px 24px',
            minHeight: '56px',
            fontWeight: '600',
            flex: 1,
            textAlign: 'center',
            '&:hover': {
              backgroundColor: '#f4f6fa',
            },
          },
        }}
        variant="fullWidth"
      >
        <Tab label="Generate Payment" value="generatePayment" />
        <Tab label="Order Status" value="orderStatus" />
      </Tabs> */}
      <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        textColor="inherit"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(to right, #dde3ed, #f4f6fa)',
          boxShadow: 'inset 0 -1px 3px rgba(0,0,0,0.05)',
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 2,
            backgroundColor: '#a36b66',
            transition: 'all 0.3s ease',
          },
          '& .MuiTab-root': {
            fontSize: '1.1rem',
            minHeight: '56px',
            fontWeight: 600,
            flex: 1,
            textAlign: 'center',
            color: '#2e3b55',
            borderRadius: 2,
            transition: 'all 0.3s ease-in-out',
            '&.Mui-selected': {
              color: '#a36b66',
              backgroundColor: '#ffffff',
              transform: 'scale(1.04)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            },
            '&:hover': {
              backgroundColor: '#eef1f8',
              transform: 'scale(1.01)',
            },
          },
        }}
      >
        <Tab label="Generate Payment" value="generatePayment" />
        <Tab label="Order Status" value="orderStatus" />
      </Tabs>

      {/* <Grid container spacing={3} justifyContent="center">
        {[
          { value: 'payOnline', icon: <CreditCardIcon />, label: 'Pay Online' },
          { value: 'payAtHotel', icon: <ApartmentIcon />, label: 'Pay at Hotel' },
        ].map(({ value, icon, label }) => (
          <Grid key={value}>
            <Paper
              onClick={() => setMainTab(value)}
              elevation={mainTab === value ? 6 : 2}
              sx={{
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: mainTab === value ? '#2e3b55' : '#fff',
                color: mainTab === value ? '#fff' : '#000',
                transition: 'all 0.3s ease',
                minWidth: 160,
              }}
            >
              {icon}
              <Typography mt={1} fontWeight="bold">
                {label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid> */}

      <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <CardContent>{renderSubContent()}</CardContent>
      </Card>
    </Box>
  )

  return (
    <Box sx={{ p: 4 }} textAlign={'center'}>
      {/* <Typography variant="h5" fontWeight="bold" mb={3}>
        Payments
      </Typography> */}
      <Typography
        variant="h2"
        sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
      >
        {convertString(journeyType)}
      </Typography>

      {/* <Box display="flex" gap={3} mb={3}>
        <Tooltip title="Online CCAvenue Payments">
          <Button
            startIcon={<CreditCardIcon />}
            variant={mainTab === 'payOnline' ? 'contained' : 'outlined'}
            onClick={() => setMainTab('payOnline')}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Pay Online
          </Button>
        </Tooltip>
        <Tooltip title="Hotel Counter Payments">
          <Button
            startIcon={<ApartmentIcon />}
            variant={mainTab === 'payAtHotel' ? 'contained' : 'outlined'}
            onClick={() => setMainTab('payAtHotel')}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
              fontWeight: '600',
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Pay At Hotel
          </Button>
        </Tooltip>
      </Box> */}

      {renderMainTab()}

      <CombinedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type="success"
        title="Payment Link Generated"
      >
        <Box textAlign="left">
          <Typography variant="body1">
            <strong>Mobile:</strong> {mobile}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> ₹{amount}
          </Typography>
          <Typography variant="body1">
            <strong>Reference ID:</strong> PAY-20250506-XYZ123
          </Typography>
        </Box>
      </CombinedModal>
    </Box>
  )
}

export default PaymentJourney
