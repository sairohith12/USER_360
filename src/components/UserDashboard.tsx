import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  TableSortLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ReplayIcon from '@mui/icons-material/Replay'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import DateInput from './DateInput'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useAuth } from '@/context/authContext'
import axios from 'axios'
import { formatDateToYYYYMMDD } from '@/utils/date'

const userRole = 'admin' // dynamic in real case

interface Filters {
  createdDate: string
  referenceNUmber: string
  transactionAmount: string
  module: string | null
  status: string | null
}

interface SortConfig {
  key: keyof Filters
  direction: 'asc' | 'desc'
}

interface EditChange {
  id: number
  field: keyof Filters
  value: string
}

interface RefundChange {
  id: number
}

const getInitialDateRange = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const dayBeforeYesterday = new Date(today)
  dayBeforeYesterday.setDate(today.getDate() - 2)

  return {
    fromDate: yesterday,
    toDate: today,
  }
}

const UserDashboard = () => {
  const { user } = useAuth()
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filters, setFilters] = useState<Filters>({
    createdDate: '',
    referenceNUmber: '',
    transactionAmount: '',
    module: null,
    status: null,
  })
  const [error, setError] = useState()
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdDate', direction: 'asc' })
  const [transactions, setTransactions] = useState<any>([])
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [viewData, setViewData] = useState<null | {
    id: number
    createdDate: string
    referenceNUmber: string
    transactionAmount: string
    module: string | null
    status: string | null
  }>(null)
  const { fromDate, toDate } = getInitialDateRange()

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(fromDate),
    dayjs(toDate),
  ])
  const [modes, setModes] = useState<any>()
  const [status, setStatus] = useState<any>()
  const handleFilterChange = (field: keyof Filters, value: string) => {
    const searchFieldKey = field?.toLowerCase() === 'ref' ? 'referenceNUmber' : field
    setFilters({ ...filters, [searchFieldKey]: value })
  }

  const handleSort = (key: keyof Filters) => {
    setSortConfig((prev: SortConfig) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const handleEditChange = (
    id: EditChange['id'],
    field: EditChange['field'],
    value: EditChange['value'],
  ) => {
    setTransactions((prev: typeof transactions) =>
      prev.map((t: any) => (t.id === id ? { ...t, [field]: value } : t)),
    )
  }

  const handleArchive = (id: number): void => {
    setTransactions((prev: typeof transactions) => prev.filter((t: any) => t.id !== id))
  }

  const handleRefund = (id: RefundChange['id']): void => {
    setTransactions((prev: typeof transactions) =>
      prev.map((t: any) => (t.id === id ? { ...t, status: 'Pending' } : t)),
    )
  }

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
  }

  const filteredTransactions = useMemo(() => {
    return transactions?.length > 0
      ? transactions?.filter((row: any) =>
          Object.keys(filters).every((key) =>
            String(row[key as keyof Filters])
              .toLowerCase()
              .includes(filters[key as keyof Filters]?.toLowerCase() || ''),
          ),
        )
      : []
  }, [filters, transactions])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      return sortConfig.direction === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
    })
  }, [filteredTransactions, sortConfig])

  const paginatedTransactions = sortedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedTransactions)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(file, 'transactions.xlsx')
  }

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedTransactions)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'transactions.csv')
  }

  const fetchData = async () => {
    setLoading(true)
    let ccAvenuePaymentResponseData
    try {
      ccAvenuePaymentResponseData = await axios.post(
        'https://api-devv2.tajhotels.com/user360agg/v1/action/transactions',

        {
          fromDate: formatDateToYYYYMMDD(dateRange[0]),
          toDate: formatDateToYYYYMMDD(dateRange[1]),
          module: filters.module,
          category: filters.module,
          status: filters.status,
          transactionBy: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            category: 'ROOM',
          },
        },
      )
    } catch (error) {
      setError((error as any)?.response?.data?.message)
      return
    } finally {
      setLoading(false)
    }
    if (ccAvenuePaymentResponseData?.status !== 200) {
      setError((error as any)?.response?.data?.message)
    } else if (ccAvenuePaymentResponseData?.status === 200) {
      setTransactions(ccAvenuePaymentResponseData?.data)
      if (ccAvenuePaymentResponseData?.data?.length > 0) {
        setStatus([...new Set(ccAvenuePaymentResponseData?.data.map((item: any) => item.status))])
        setModes([...new Set(ccAvenuePaymentResponseData?.data.map((item: any) => item.module))])
      }
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dateRange])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        My Account Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          User Information
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'First Name', value: user?.firstName },
            { label: 'Last Name', value: user?.lastName },
            { label: 'Employee ID', value: user?.employeeId },
            { label: 'Email', value: user?.email },
            { label: 'Property Name', value: user?.propertyName },
            { label: 'Property ID', value: user?.propertyId },
          ].map((item, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 3 }} />
      </Paper>

      <Grid container spacing={3} sx={{ alignItems: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateInput
            name="startDate"
            label="Start Date"
            value={dateRange?.[0] ? dateRange[0].toISOString() : ''}
            onChange={(name: string, date: Date | null) =>
              setDateRange([date ? dayjs(date) : null, dateRange[1]])
            }
            customStyle={{
              flex: '1 1 20%',
              backgroundColor: '-moz-initial',
            }}
          />

          <DateInput
            name="endDate"
            label="End Date"
            value={dateRange?.[1] ? dateRange[1].toISOString() : ''}
            onChange={(name: string, date: Date | null) =>
              setDateRange([dateRange[0], date ? dayjs(date) : null])
            }
            customStyle={{
              flex: '1 1 20%',
              backgroundColor: '-moz-initial',
            }}
          />
        </LocalizationProvider>
        {modes?.map((module: string) => (
          <Chip
            key={module}
            label={module}
            variant={filters.module === module ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => handleFilterChange('module', module)}
            onDelete={
              filters.module === module ? () => handleFilterChange('module', '') : undefined
            }
          />
        ))}

        {status?.map((status: string) => (
          <Chip
            key={status}
            label={status}
            variant={filters.status === status ? 'filled' : 'outlined'}
            color="secondary"
            onClick={() => handleFilterChange('status', status)}
            onDelete={
              filters.status === status ? () => handleFilterChange('status', '') : undefined
            }
          />
        ))}

        {/* Transactions Table */}
        {loading ? (
          <Box sx={{ textAlign: 'center', width: '100%', marginTop: '5vh' }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Loading, please wait...
            </Typography>
          </Box>
        ) : (
          <>
            {transactions?.length !== 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent Transactions
                    </Typography>
                    <Box>
                      <Button variant="outlined" onClick={exportToCSV} sx={{ mr: 1 }}>
                        Export CSV
                      </Button>
                      <Button variant="contained" onClick={exportToExcel}>
                        Export Excel
                      </Button>
                    </Box>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {(
                            [
                              'createdDate',
                              'ref',
                              'category',
                              'amount',
                              'module',
                              'status',
                            ] as (keyof Filters)[]
                          ).map((key) => (
                            <TableCell key={key}>
                              <TableSortLabel
                                active={sortConfig.key === key}
                                direction={sortConfig.direction}
                                onClick={() => handleSort(key)}
                              >
                                {key.toUpperCase()}
                              </TableSortLabel>
                              <TextField
                                variant="standard"
                                value={filters[key]}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                placeholder={`Search ${key}`}
                                fullWidth
                              />
                            </TableCell>
                          ))}
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedTransactions.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell align="center">
                              {formatDateToYYYYMMDD(row.createdDate)}
                            </TableCell>
                            <TableCell align="center">
                              {row.referenceNUmber ? row.referenceNUmber : 'NA'}
                              {row.referenceNUmber && (
                                <IconButton
                                  onClick={() => copyToClipboard(row.referenceNUmber)}
                                  size="small"
                                >
                                  <ContentCopyIcon fontSize="inherit" />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell align="center">{row.category}</TableCell>
                            <TableCell align="center">
                              {row.transactionAmount || row.pointsRedeemed || row.pointsToBeAwarded
                                ? row.transactionAmount ||
                                  row.pointsRedeemed ||
                                  row.pointsToBeAwarded
                                : 'NA'}
                            </TableCell>
                            <TableCell align="center">
                              {userRole === 'admin' && editRowId === row.id ? (
                                <TextField
                                  value={row.module}
                                  onChange={(e) =>
                                    handleEditChange(row.id, 'module', e.target.value)
                                  }
                                />
                              ) : (
                                row.module
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={row.status}
                                color={
                                  row.status === 'Success' || row.status === 'true'
                                    ? 'success'
                                    : row.status === 'Failed'
                                    ? 'error'
                                    : 'warning'
                                }
                                variant="outlined"
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton onClick={() => setViewData(row)}>
                                <VisibilityIcon />
                              </IconButton>
                              {/* {userRole === 'admin' && (
                            <IconButton
                              onClick={() => setEditRowId(editRowId === row.id ? null : row.id)}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <IconButton onClick={() => handleArchive(row.id)}>
                            <DeleteIcon />
                          </IconButton> */}
                              {/* {(row.status === 'Failed' || row.status === 'Refunded') && (
                            <IconButton onClick={() => handleRefund(row.id)}>
                              <ReplayIcon />
                            </IconButton>
                          )} */}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={sortedTransactions.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10))
                      setPage(0)
                    }}
                    rowsPerPageOptions={Array.from(
                      { length: Math.ceil(sortedTransactions.length / 5) },
                      (_, i) => (i + 1) * 5,
                    )}
                  />
                </Paper>
              </Grid>
            )}
          </>
        )}
      </Grid>
      {transactions?.length === 0 && (
        <Box sx={{ textAlign: 'center', width: '100%', marginTop: '5vh' }}>
          No Results found for your search Criteria
        </Box>
      )}
      <Dialog open={!!viewData} onClose={() => setViewData(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {viewData && (
            <Box>
              {Object.entries(viewData).map(([key, value]) => (
                <>
                  {value && (
                    <Typography key={key} gutterBottom>
                      <strong>{key.toUpperCase()}:</strong> {value}
                    </Typography>
                  )}
                </>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewData(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserDashboard
