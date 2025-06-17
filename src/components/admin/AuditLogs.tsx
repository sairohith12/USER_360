import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
  Chip,
  TextField,
  TablePagination,
  Button,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { saveAs } from 'file-saver'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import api from 'api/axios'
// import { parse } from 'json2csv'

const AuditLogs = () => {
  const [statusFilter, setStatusFilter] = useState('All')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [logsData, setLogsData] = useState([])
  const [fetchDataError, setFetchDataError] = useState()

  const filteredLogs = logsData.filter((log: any) => {
    const matchStatus = statusFilter === 'All' || log.status === statusFilter
    const matchSearch =
      search === '' ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.performed_by.toLowerCase().includes(search.toLowerCase())
    const logDate = dayjs(log.timestamp)
    const matchStartDate = !startDate || logDate >= startDate
    const matchEndDate = !endDate || logDate <= endDate
    return matchStatus && matchSearch && matchStartDate && matchEndDate
  })

  const fetchModuleData = async () => {
    setLoading(true)
    let allData
    try {
      allData = await api.get('admin/audit-info', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (allData?.status === 200) {
        if (allData?.data?.data?.length > 0) {
          setLogsData(allData?.data?.data)
        }
      }
    } catch (error) {
      setFetchDataError(
        (error as any)?.response?.message ||
          (error as any)?.message ||
          'Error Occured while fetching the logs data ',
      )
      return
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchModuleData()
  }, [])
  const handleExport = () => {
    // const csv = parse(filteredLogs)
    // const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    // saveAs(blob, 'audit-logs.csv')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={4}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Audit Logs
        </Typography>

        <Paper sx={{ mt: 4, p: 3, borderRadius: 3 }} elevation={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Success">Success</MenuItem>
                <MenuItem value="Failure">Failure</MenuItem>
              </Select>
            </FormControl>

            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { size: 'small' } }}
            />

            <TextField
              size="small"
              label="Search by action, user or target"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button variant="outlined" onClick={handleExport} sx={{ whiteSpace: 'nowrap' }}>
              Export CSV
            </Button>
          </Stack>

          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Timestamp</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Module</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Performed By</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Performed To</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  {/* <TableCell>
                    <strong>Details</strong>
                  </TableCell> */}
                  <TableCell>
                    <strong>Property</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log: any, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.module}</TableCell>
                      <TableCell>{log.performed_by}</TableCell>
                      <TableCell>{log.performed_to || '—'}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.status || 'failed'}
                          size="small"
                          color={log.status === 'Success' ? 'success' : 'error'}
                        />
                      </TableCell>
                      {/* <TableCell>{log.details}</TableCell> */}
                      <TableCell>{log.hotel_name}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredLogs.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  )
}

export default AuditLogs
