import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material'

import CombinedModal from '@/components/modal/ReponseModal'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DateInput from '../DateInput'
import dayjs, { Dayjs } from 'dayjs'
import KeyValueList from '@/utils/KeyValueList'

const Refunds = () => {
  const [reference, setReference] = useState('')
  const [fromDate, setFromDate] = useState<Dayjs | null>(null)
  const [fetchedData, setFetchedData] = useState<{
    guest: string
    amount: number
    status: string
    refId: string
    date: Dayjs | null
  } | null>(null)
  const [status, setStatus] = useState('pending')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundType, setRefundType] = useState('full')
  const [reason, setReason] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showRefundForm, setShowRefundForm] = useState(false)

  const handleFetch = () => {
    setFetchedData({
      guest: 'John Doe',
      amount: 1200,
      status: 'pending',
      refId: reference,
      date: dayjs('2024-03-11'),
    })
    setStatus('pending')
    setShowRefundForm(false)
  }

  const handleRefund = () => {
    setModalOpen(true)
  }

  const handleRecheckStatus = () => {
    setLoading(true)
    setTimeout(() => {
      setStatus('success')
      setLoading(false)
      setShowRefundForm(false)
    }, 1500)
  }

  const refundResponseData = [
    {
      label: 'Status',
      value: 'Success',
    },
    {
      label: 'Refund ID',
      value: 'CC_uhwnj29',
    },
    {
      label: 'Refund Amount',
      value: refundAmount,
    },
  ]

  return (
    <Box sx={{ p: 4 }} textAlign={'center'}>
      <Typography
        variant="h2"
        sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
      >
        Refund Management
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 500, mx: 'auto' }}>
        <Grid container direction="column" spacing={3}>
          <Grid>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              gutterBottom
              sx={{
                textAlign: 'center',
                backgroundColor: '#f4f6fa',
                borderRadius: 2,
                p: 1.5,
                mb: 1,
                fontSize: '1.1rem',
              }}
            >
              Lookup Transaction by Order / Reference ID
            </Typography>
            <TextField
              label="Reference Number"
              fullWidth
              value={reference}
              placeholder="Reference Number / Order Number"
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
              disabled={!reference.trim() && !fetchedData}
            >
              Check Status
            </Button>
          </Grid>
        </Grid>

        {fetchedData && (
          <Box mt={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#f4f6fa' }}>
              <CardContent>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mt={1}
                  justifyContent={'space-between'}
                >
                  <Typography variant="h6">
                    <strong>Guest:</strong> {fetchedData.guest}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Amount:</strong> ₹{fetchedData.amount}
                  </Typography>
                </Box>

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

            {status === 'success' && !showRefundForm && (
              <Box mt={4} p={3} sx={{ borderRadius: 2, bgcolor: '#e3f2fd', textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Transaction Verified ✅
                </Typography>
                <Typography variant="body1" mb={3}>
                  Do you want to initiate a refund for this transaction?
                </Typography>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowRefundForm(true)}
                  >
                    Yes, Initiate Refund
                  </Button>
                  <Button variant="outlined" onClick={() => setShowRefundForm(false)}>
                    No
                  </Button>
                </Box>
              </Box>
            )}

            {status === 'success' && showRefundForm && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Initiate Refund
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ md: 6 }}>
                    <TextField
                      select
                      label="Refund Type"
                      fullWidth
                      value={refundType}
                      onChange={(e) => setRefundType(e.target.value)}
                    >
                      <MenuItem value="full">Full</MenuItem>
                      <MenuItem value="partial">Partial</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Refund Amount"
                      fullWidth
                      type="number"
                      disabled={refundType === 'full'}
                      value={refundType === 'full' ? fetchedData.amount : refundAmount}
                      error={Number(refundAmount) > fetchedData.amount}
                      helperText={
                        Number(refundAmount) > fetchedData.amount &&
                        'Please select the valid Amount'
                      }
                      onChange={(e) => setRefundAmount(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Reason*"
                      fullWidth
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={
                        !reason ||
                        Number(refundAmount) == 0 ||
                        Number(refundAmount) > Number(fetchedData.amount)
                      }
                      onClick={handleRefund}
                      fullWidth
                      sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
                    >
                      Initiate Refund
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {modalOpen && (
        <CombinedModal
          onClose={() => {
            setModalOpen(false)
            setFetchedData(null)
            setStatus('pending')
            setReference('')
            setFromDate(null)
          }}
          open={modalOpen}
          type={'success'}
        >
          <KeyValueList data={refundResponseData} />
        </CombinedModal>
      )}
    </Box>
  )
}

export default Refunds
