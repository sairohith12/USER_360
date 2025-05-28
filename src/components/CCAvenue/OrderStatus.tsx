import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Collapse,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
import * as XLSX from 'xlsx'
import DateInput from '../DateInput'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { formatDateToDDMMYYYY } from '@/utils/date'
import axios from 'axios'
import { saveAs } from 'file-saver'

const OrderStatus = () => {
  const [selectedField, setSelectedField] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [fromDate, setFromDate] = useState<Dayjs | null>(null)
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [recheckLoading, setRecheckLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldError, setFieldError] = useState(false)
  const [fromDateError, setFromDateError] = useState(false)
  const handleFetch = async () => {
    let hasError = false
    if (!fromDate) {
      setFromDateError(true)
      hasError = true
    } else {
      setFromDateError(false)
    }
    if (!selectedField || !isFieldValid()) {
      setFieldError(true)
      hasError = true
    } else {
      setFieldError(false)
    }
    if (hasError) {
      setErrorMsg('Please correct the highlighted fields.')
      return
    }
    setErrorMsg('')
    let fetchOrderData
    try {
      setLoading(true)
      fetchOrderData = await axios.post(
        'https://api-devv2.tajhotels.com/user360agg/v1/ccavenue/order-lookUp',
        {
          fromDate: formatDateToDDMMYYYY(fromDate),
          emailId: selectedField === 'emailId' ? inputValue : '',
          mobileNo: selectedField === 'mobileNo' ? inputValue : '',
          toDate: selectedField === 'toDate' ? formatDateToDDMMYYYY(inputValue) : '',
          referenceNo: selectedField === 'referenceNo' ? inputValue : '',
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
      setRecords(fetchOrderData?.data?.order_Status_List)
    }
  }

  const handleRecheckStatus = async () => {
    setRecheckLoading(true)
    await handleFetch()
    setRecheckLoading(false)
  }

  const isFieldValid = () => {
    if (selectedField === 'toDate') {
      return inputValue !== ''
    } else {
      return inputValue.trim() !== ''
    }
  }

  const handleCSVExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(records)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${inputValue}_transactions.csv`)
  }

  return (
    <Box sx={{ p: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, maxWidth: 500, mx: 'auto' }}>
        <Grid container direction="column" spacing={3}>
          <Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateInput
                name="fromDate"
                label="From Date *"
                value={fromDate ? fromDate.toISOString() : ''}
                onChange={(name, date) => {
                  setFromDate(date ? dayjs(date) : null)
                  setFromDateError(false)
                }}
                error={fromDateError}
                helperText={fromDateError ? 'From Date is required' : ''}
                customStyle={{
                  backgroundColor: '-moz-initial',
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid>
            <FormControl fullWidth>
              <InputLabel>Select Field</InputLabel>
              <Select
                value={selectedField}
                label="Select Field"
                onChange={(e) => {
                  setSelectedField(e.target.value)
                  setInputValue('')
                  setErrorMsg('')
                  setRecords([])
                }}
              >
                <MenuItem value="emailId">Email ID</MenuItem>
                <MenuItem value="mobileNo">Mobile Number</MenuItem>
                <MenuItem value="toDate">Records By Date Range</MenuItem>
                <MenuItem value="referenceNo">CC Avenue Reference Number</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {selectedField && (
            <Grid>
              {selectedField === 'toDate' ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateInput
                    name="toDate"
                    label="To Date"
                    value={inputValue || ''}
                    onChange={(name, date) => {
                      setInputValue(date ? dayjs(date).toISOString() : '')
                      setErrorMsg('')
                      setRecords([])
                    }}
                    customStyle={{
                      backgroundColor: '-moz-initial',
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  label={
                    selectedField === 'emailId'
                      ? 'Email ID'
                      : selectedField === 'mobileNo'
                      ? 'Mobile Number'
                      : 'Reference Number'
                  }
                  fullWidth
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setFieldError(false)
                    setErrorMsg('')
                    setRecords([])
                  }}
                  error={fieldError}
                  helperText={fieldError ? 'Please enter a valid value' : ''}
                />
              )}
            </Grid>
          )}
          <Grid>
            <Button
              variant="contained"
              fullWidth
              onClick={handleFetch}
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
              disabled={loading || !fromDate || !selectedField || !isFieldValid()}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {selectedField === 'referenceNo' ? 'CHECK STATUS' : 'FETCH RECORDS'}
            </Button>
          </Grid>
        </Grid>

        <Grid>
          <Collapse in={!!errorMsg}>
            <Typography color="error" sx={{ fontWeight: 500, textAlign: 'center', mt: 1 }}>
              {errorMsg}
            </Typography>
          </Collapse>
        </Grid>
        {records?.length > 0 && (
          <Box mt={4}>
            <Card sx={{ borderRadius: 3, bgcolor: '#f4f6fa' }}>
              <CardContent>
                <Typography variant="h6">
                  <strong>Guest:</strong> {records?.[0]?.order_bill_name}
                </Typography>
                <Typography variant="h6">
                  <strong>Amount:</strong> ₹{records?.[0]?.order_amt}
                </Typography>
                <Box display="flex" alignItems="center" mt={1} justifyContent="space-between">
                  <Typography variant="h6">
                    <strong>Status:</strong> {records?.[0]?.order_status}
                  </Typography>
                  {(records?.[0]?.order_status?.toLowerCase() === 'awaited' ||
                    records?.[0]?.order_status?.toLowerCase() === 'initiated') &&
                    (recheckLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Button
                        variant="outlined"
                        sx={{ fontWeight: 'bold', px: 3, py: 0.8, borderRadius: 2 }}
                        onClick={handleRecheckStatus}
                        startIcon={recheckLoading && <CircularProgress size={20} color="inherit" />}
                      >
                        Re-Check Status
                      </Button>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        {records?.length > 0 && !loading && !recheckLoading && (
          <>
            <Box display="flex" alignItems={'center'} justifyContent={'space-between'}>
              <Box textAlign="left" mt={2}>
                {'Dowload to View the Records ->'}
              </Box>
              <Box textAlign="right" mt={2}>
                <Button variant="contained" onClick={handleCSVExport}>
                  Export to CSV
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default OrderStatus
