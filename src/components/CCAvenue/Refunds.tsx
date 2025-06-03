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
  Collapse,
} from '@mui/material'

import CombinedModal from '@/components/modal/ReponseModal'
import { Dayjs } from 'dayjs'
import KeyValueList from '@/utils/KeyValueList'
import axios from 'axios'

const Refunds = () => {
  const [reference, setReference] = useState('')
  const [fetchedData, setFetchedData] = useState<{
    order_bill_name: string
    order_amt: number
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
  const [errorMsg, setErrorMsg] = useState('')
  const [modalType, setModalType] = useState<'success' | 'failure'>('success')
  const [apiResponseData, setApiResponseData] = useState<any>([])

  const handleFetch = async () => {
    if (!reference) {
      setErrorMsg('Please correct the highlighted fields.')
      return
    }
    setErrorMsg('')
    setShowRefundForm(false)
    let fetchOrderData
    try {
      setLoading(true)
      fetchOrderData = await axios.post(
        'https://api-devv2.tajhotels.com/user360agg/v1/ccavenue/order-status',
        {
          referenceNo: reference,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Category: 'ROOM',
          },
        },
      )
    } catch (error) {
      setErrorMsg('No record found for given criteria.')
    } finally {
      setLoading(false)
    }
    if (fetchOrderData?.status == 200) {
      setFetchedData(fetchOrderData?.data)
      setStatus(fetchOrderData?.data?.order_status)
    }
  }
  const handleRefund = async () => {
    setErrorMsg('')
    setShowRefundForm(false)
    let refundData
    try {
      setLoading(true)
      refundData = await axios.post(
        'https://api-devv2.tajhotels.com/user360agg/v1/ccavenue/action/refund',
        {
          referenceNo: reference,
          refundAmount: refundAmount,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Category: 'ROOM',
          },
        },
      )
    } catch (error) {
      setModalOpen(true)
      setModalType('failure')
      setApiResponseData([
        {
          label: 'Refund TransactionId',
          value: refundData?.data?.refundTransactionId,
        },
        {
          label: 'Error Reason',
          value: refundData?.data?.reason,
        },
      ])
    } finally {
      setLoading(false)
    }
    if (refundData?.status == 200 && refundData?.data?.errorCode === 200) {
      setModalOpen(true)
      setModalType('success')
      setApiResponseData([
        {
          label: 'Refund TransactionId',
          value: refundData?.data?.refundTransactionId,
        },
        {
          label: 'Refund Amount',
          value: refundData?.data?.refundAmount,
        },
      ])
    } else {
      setModalOpen(true)
      setModalType('failure')
      setApiResponseData([
        {
          label: 'Refund TransactionId',
          value: refundData?.data?.refundTransactionId,
        },
        {
          label: 'Error Reason',
          value: refundData?.data?.reason,
        },
      ])
    }
  }

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
                setShowRefundForm(false)
                setErrorMsg('')
              }}
            />
          </Grid>
          <Grid>
            <Collapse in={!!errorMsg}>
              <Typography color="error" sx={{ fontWeight: 500, textAlign: 'center', mt: 1 }}>
                {errorMsg}
              </Typography>
            </Collapse>
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
                    <strong>Guest:</strong> {fetchedData?.order_bill_name}
                  </Typography>
                  <Typography variant="h6">
                    <strong>Amount:</strong> ₹{fetchedData.order_amt}
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

                  {(status?.toLowerCase() === 'awaited' || status?.toLowerCase() === 'initiated') &&
                    (loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Button
                        variant="outlined"
                        sx={{ fontWeight: 'bold', px: 3, py: 0.8, borderRadius: 2 }}
                        onClick={handleFetch}
                      >
                        Re-Check Status
                      </Button>
                    ))}
                </Box>
              </CardContent>
            </Card>

            {(status?.toLowerCase() === 'successful' || status?.toLowerCase() === 'shipped') &&
              !showRefundForm && (
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
                      onClick={() => {
                        setShowRefundForm(true)
                      }}
                    >
                      Yes, Initiate Refund
                    </Button>
                    <Button variant="outlined" onClick={() => setShowRefundForm(false)}>
                      No
                    </Button>
                  </Box>
                </Box>
              )}

            {(status?.toLowerCase() === 'successful' || status?.toLowerCase() === 'shipped') &&
              showRefundForm && (
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
                        value={refundType === 'full' ? fetchedData.order_amt : refundAmount}
                        error={
                          Number(refundAmount) > fetchedData.order_amt && Number(refundAmount) > 0
                        }
                        helperText={
                          Number(refundAmount) > fetchedData.order_amt &&
                          Number(refundAmount) > 0 &&
                          `Please select the Amount less than or equal to ${fetchedData.order_amt}`
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
                          Number(refundAmount) > Number(fetchedData.order_amt)
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
            setApiResponseData([])
            setErrorMsg('')
            setModalType('success')
            setShowRefundForm(false)
            setReason('')
            setRefundAmount('')
          }}
          open={modalOpen}
          type={modalType}
        >
          <KeyValueList data={apiResponseData} />
        </CombinedModal>
      )}
    </Box>
  )
}

export default Refunds
