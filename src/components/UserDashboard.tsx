import React, { useState, useMemo } from 'react'
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

const userRole = 'admin' // dynamic in real case

const userInfo = {
  firstName: 'Amit',
  lastName: 'Verma',
  employeeId: 'EMP10293',
  email: 'amit.verma@example.com',
  propertyName: 'The Grand Palace',
  propertyId: 'PROP001',
}

const initialTransactions = [
  { id: 1, date: '2025-04-10', ref: 'TXN001', amount: 1200, mode: 'Pay Online', status: 'Success' },
  { id: 2, date: '2025-04-08', ref: 'TXN002', amount: 500, mode: 'Pay At Hotel', status: 'Failed' },
  { id: 3, date: '2025-04-05', ref: 'TXN003', amount: 800, mode: 'Pay Online', status: 'Refunded' },
  {
    id: 4,
    date: '2025-04-02',
    ref: 'TXN004',
    amount: 300,
    mode: 'Pay At Hotel',
    status: 'Success',
  },
  { id: 5, date: '2025-04-10', ref: 'TXN005', amount: 1200, mode: 'Pay Online', status: 'Success' },
  { id: 6, date: '2025-04-08', ref: 'TXN006', amount: 500, mode: 'Pay At Hotel', status: 'Failed' },
  { id: 7, date: '2025-04-05', ref: 'TXN007', amount: 800, mode: 'Pay Online', status: 'Refunded' },
  {
    id: 8,
    date: '2025-04-02',
    ref: 'TXN008',
    amount: 300,
    mode: 'Pay At Hotel',
    status: 'Success',
  },
]
interface Filters {
  date: string
  ref: string
  amount: string
  mode: string
  status: string
}

interface SortConfig {
  key: keyof Filters
  direction: 'asc' | 'desc'
}

const UserDashboard = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filters, setFilters] = useState<Filters>({
    date: '',
    ref: '',
    amount: '',
    mode: '',
    status: '',
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'asc' })
  const [transactions, setTransactions] = useState(initialTransactions)
  const [editRowId, setEditRowId] = useState<number | null>(null)
  const [viewData, setViewData] = useState<null | {
    id: number
    date: string
    ref: string
    amount: number
    mode: string
    status: string
  }>(null)
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSort = (key: keyof Filters) => {
    setSortConfig((prev: SortConfig) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  interface EditChange {
    id: number
    field: keyof Filters
    value: string
  }

  const handleEditChange = (
    id: EditChange['id'],
    field: EditChange['field'],
    value: EditChange['value'],
  ) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)))
  }

  const handleArchive = (id: number): void => {
    setTransactions((prev: typeof initialTransactions) => prev.filter((t) => t.id !== id))
  }

  interface RefundChange {
    id: number
  }

  const handleRefund = (id: RefundChange['id']): void => {
    setTransactions((prev: typeof initialTransactions) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Pending' } : t)),
    )
  }

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
  }

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((row) =>
      Object.keys(filters).every((key) =>
        row[key as keyof Filters]
          .toString()
          .toLowerCase()
          .includes(filters[key as keyof Filters].toLowerCase()),
      ),
    )
  }, [filters])

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
            { label: 'First Name', value: userInfo.firstName },
            { label: 'Last Name', value: userInfo.lastName },
            { label: 'Employee ID', value: userInfo.employeeId },
            { label: 'Email', value: userInfo.email },
            { label: 'Property Name', value: userInfo.propertyName },
            { label: 'Property ID', value: userInfo.propertyId },
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

        <Stack spacing={2} direction="row" alignItems="center" flexWrap="wrap">
          {/* <DateRangePicker
            value={dateRange}
            onChange={(newRange: [Date | null, Date | null] | null) =>
              setDateRange(newRange ? [newRange[0] as Dayjs | null, newRange[1] as Dayjs | null] : [null, null])
            }
            slotProps={{ textField: { size: 'small', variant: 'outlined' } }}
          /> */}
        </Stack>
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

        {['Pay Online', 'Pay At Hotel'].map((mode: string) => (
          <Chip
            key={mode}
            label={mode}
            variant={filters.mode === mode ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => handleFilterChange('mode', mode)}
            onDelete={filters.mode === mode ? () => handleFilterChange('mode', '') : undefined}
          />
        ))}

        {['Success', 'Failed', 'Refunded'].map((status: string) => (
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
                    {(['date', 'ref', 'amount', 'mode', 'status'] as (keyof Filters)[]).map(
                      (key) => (
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
                      ),
                    )}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {row.ref}
                        <IconButton onClick={() => copyToClipboard(row.ref)} size="small">
                          <ContentCopyIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        {userRole === 'admin' && editRowId === row.id ? (
                          <TextField
                            value={row.mode}
                            onChange={(e) => handleEditChange(row.id, 'mode', e.target.value)}
                          />
                        ) : (
                          row.mode
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          color={
                            row.status === 'Success'
                              ? 'success'
                              : row.status === 'Failed'
                              ? 'error'
                              : 'warning'
                          }
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => setViewData(row)}>
                          <VisibilityIcon />
                        </IconButton>
                        {userRole === 'admin' && (
                          <IconButton
                            onClick={() => setEditRowId(editRowId === row.id ? null : row.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton onClick={() => handleArchive(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                        {(row.status === 'Failed' || row.status === 'Refunded') && (
                          <IconButton onClick={() => handleRefund(row.id)}>
                            <ReplayIcon />
                          </IconButton>
                        )}
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
              rowsPerPageOptions={[5, 10, 25]}
            />
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={!!viewData} onClose={() => setViewData(null)}>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogContent>
          {viewData && (
            <Box>
              {Object.entries(viewData).map(([key, value]) => (
                <Typography key={key} gutterBottom>
                  <strong>{key.toUpperCase()}:</strong> {value}
                </Typography>
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
