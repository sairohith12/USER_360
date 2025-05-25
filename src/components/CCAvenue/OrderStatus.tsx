import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
// import CreditCardIcon from '@mui/icons-material/CreditCard'
// import ApartmentIcon from '@mui/icons-material/Apartment'
import DateInput from '../DateInput'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

const OrderStatus = () => {
  const [reference, setReference] = useState('')
  const [fromDate, setFromDate] = useState<Dayjs | null>(null)
  const [fetchedData, setFetchedData] = useState<{ guest: string; amount: string } | null>(null)
  const [status, setStatus] = useState('pending')
  const [loading, setLoading] = useState(false)

  const handleFetch = () => {
    setFetchedData({
      guest: 'John Doe',
      amount: '1200',
    })
    setStatus('pending')
  }

  const handleRecheckStatus = () => {
    setLoading(true)
    setTimeout(() => {
      setStatus('success')
      setLoading(false)
    }, 1500)
  }
  return (
    <Box sx={{ p: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 500, mx: 'auto' }}>
        <Grid container direction="column" spacing={3}>
          <Grid>
            <TextField
              label="Reference Number"
              fullWidth
              value={reference}
              onChange={(e) => {
                setReference(e.target.value)
                setFetchedData(null)
              }}
            />
          </Grid>
          <Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateInput
                key={'fromDate'}
                name={'fromDate'}
                label={'From Date'}
                value={fromDate ? fromDate.toISOString() : ''}
                onChange={(name, date) => {
                  setFromDate(date ? dayjs(date) : null)
                  setFetchedData(null)
                }}
                // error={fromDate ? false : true}
                helperText={(!fromDate && 'Please select Valid From Date ') || ''}
                customStyle={{
                  flex: '1 1 30%',
                  backgroundColor: '-moz-initial',
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              onClick={handleFetch}
              fullWidth
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
              disabled={(!reference.trim() || !fromDate) && !fetchedData}
            >
              Check Status
            </Button>
          </Grid>
        </Grid>

        {fetchedData && (
          <Box mt={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#f4f6fa' }}>
              <CardContent>
                <Typography variant="h6">
                  <strong>Guest:</strong> {fetchedData.guest}
                </Typography>
                <Typography variant="h6">
                  <strong>Amount:</strong> ₹{fetchedData.amount}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mt={1}
                  justifyContent={'space-between'}
                >
                  <Typography variant="h6">
                    <strong>Status:</strong> {status}
                  </Typography>

                  {status === 'pending' &&
                    (loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Button
                        variant="outlined"
                        sx={{ fontWeight: 'bold', px: 3, py: 0.8, borderRadius: 2 }}
                        onClick={handleRecheckStatus}
                      >
                        Re-Check Status
                      </Button>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default OrderStatus
