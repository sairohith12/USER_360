import React, { useMemo, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TextField,
  TableBody,
  TablePagination,
  IconButton,
} from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab'
import { CheckCircle, Replay } from '@mui/icons-material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

// import { DataGrid } from '@mui/x-data-grid'

const COLORS = ['#2e3b55', '#ff6f61', '#555555']
const userRole = 'admin'
const userInfo = {
  firstName: 'Amit',
  lastName: 'Verma',
  employeeId: 'EMP10293',
  email: 'amit.verma@example.com',
  propertyName: 'The Grand Palace',
  propertyId: 'PROP001',
}

const adminMetrics = {
  totalTransactions: 2450,
  successRate: '91.2%',
  refundCount: 37,
  failedCount: 52,
  totalAmount: '₹12,35,000',
}

const transactionData = [
  { date: '2025-04-01', amount: 300 },
  { date: '2025-04-05', amount: 500 },
  { date: '2025-04-10', amount: 700 },
  { date: '2025-04-15', amount: 200 },
]

const paymentModeData = [
  { name: 'NeuCoins', value: 45 },
  { name: 'GiftCards', value: 35 },
  { name: 'Vouchers', value: 20 },
]

const initialTransactions = [
  {
    id: 1,
    date: '2025-04-10',
    ref: 'TXN001',
    amount: 1200,
    mode: 'NeuCoins',
    status: 'Success',
    hotelName: 'The Grand Palace',
  },
  {
    id: 2,
    date: '2025-04-08',
    ref: 'TXN002',
    amount: 500,
    mode: 'GiftCards',
    status: 'Failed',
    hotelName: 'The Taj lands end',
  },
  {
    id: 3,
    date: '2025-04-05',
    ref: 'TXN003',
    amount: 800,
    mode: 'NeuCoins',
    status: 'Refunded',
    hotelName: 'The Taj Mahal Palace',
  },
  {
    id: 4,
    date: '2025-04-02',
    ref: 'TXN004',
    amount: 300,
    mode: 'GiftCards',
    status: 'Success',
    hotelName: 'The Taj Mahal Palace',
  },
  {
    id: 5,
    date: '2025-04-10',
    ref: 'TXN005',
    amount: 1200,
    mode: 'NeuCoins',
    status: 'Success',
    hotelName: 'Ginger Mumbai Airport',
  },
  {
    id: 6,
    date: '2025-04-08',
    ref: 'TXN006',
    amount: 500,
    mode: 'GiftCards',
    status: 'Failed',
    hotelName: 'Vivanta Goa Panjim',
  },
  {
    id: 7,
    date: '2025-04-05',
    ref: 'TXN007',
    amount: 800,
    mode: 'NeuCoins',
    status: 'Refunded',
    hotelName: 'President Mumbai Seleqtions',
  },
  {
    id: 8,
    date: '2025-04-02',
    ref: 'TXN008',
    amount: 300,
    mode: 'Vouchers',
    status: 'Success',
    hotelName: 'Ginger Mumbai Airport',
  },
]

const activityLog = [
  {
    time: '10:30 AM',
    action: 'Refund Initiated',
    hotel: 'Taj Mahal Palace',
    //icon: <Refund color="warning" />,
    icon: <Replay color="info" />,
  },
  {
    time: '09:20 AM',
    action: 'GiftCard Redeemed',
    hotel: 'Ginger Mumbai',
    icon: <CheckCircle color="success" />,
  },
  {
    time: 'Yesterday',
    action: 'Reversal Approved',
    hotel: 'Vivanta Goa',
    icon: <Replay color="info" />,
  },
]

const reversalData = [
  { label: 'Pending Reversals', count: 8, color: '#ff9800' },
  { label: 'Approved Reversals', count: 21, color: '#4caf50' },
  { label: 'Declined Reversals', count: 5, color: '#f44336' },
]

const redemptionStats = [
  { name: 'Success', value: 70 },
  { name: 'Failed', value: 20 },
  { name: 'Reversed', value: 10 },
]

const reversalRedemptionTrend = [
  { month: 'Jan', redemptions: 400, reversals: 120 },
  { month: 'Feb', redemptions: 520, reversals: 200 },
  { month: 'Mar', redemptions: 610, reversals: 150 },
]
interface Filters {
  date: string
  ref: string
  amount: string
  mode: string
  status: string
  hotelName: string
}

interface SortConfig {
  key: keyof Filters
  direction: 'asc' | 'desc'
}

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [filters, setFilters] = useState<Filters>({
    date: '',
    ref: '',
    amount: '',
    mode: '',
    status: '',
    hotelName: '',
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'asc' })

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

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters({ ...filters, [field]: value })
  }

  const handleSort = (key: keyof Filters) => {
    setSortConfig((prev: SortConfig) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
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
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {userRole === 'admin' && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Admin Metrics Overview
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Total Transactions', value: adminMetrics.totalTransactions },
              { label: 'Total Amount', value: adminMetrics.totalAmount },
              { label: 'Success Rate', value: adminMetrics.successRate },
              { label: 'Refunded Transactions', value: adminMetrics.refundCount },
              { label: 'Failed Transactions', value: adminMetrics.failedCount },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, xl: 2 }} key={idx}>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        {[
          { label: 'Total Spent', value: '₹2,800' },
          { label: 'Total Refunds', value: '₹800' },
          { label: 'Transactions', value: transactions.length.toString() },
        ].map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card sx={{ background: '#f4f6fa', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Spending Trend
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#2e3b55" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Payment Mode Split
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Reversal Summary
            </Typography>
            <Grid container spacing={2}>
              {reversalData.map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: item.color }}>
                      {item.count}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Reversals vs Redemptions Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Reversals vs Redemptions
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reversalRedemptionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="redemptions" fill="#2e3b55" />
                <Bar dataKey="reversals" fill="#ff6f61" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Redemption Status Donut Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Redemption Status Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={redemptionStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {redemptionStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recent Activity
            </Typography>
            <Timeline>
              {activityLog.map((log, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary">
                    {log.time}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot>{log.icon}</TimelineDot>
                    {index < activityLog.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography fontWeight={500}>{log.action}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {log.hotel}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              All Transactions
            </Typography>
            {/* <DataGrid
              rows={transactions}
              columns={[
                { field: 'date', headerName: 'Date', width: 120 },
                { field: 'ref', headerName: 'Transaction Ref', width: 150 },
                { field: 'amount', headerName: 'Amount (₹)', width: 130 },
                { field: 'mode', headerName: 'Mode', width: 130 },
                { field: 'status', headerName: 'Status', width: 130 },
                { field: 'hotelName', headerName: 'Hotel', width: 200 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              getRowId={(row) => row.id}
            /> */}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {(
                      ['date', 'ref', 'amount', 'mode', 'status', 'hotelName'] as (keyof Filters)[]
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
                      <TableCell>{row.mode}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.hotelName}</TableCell>
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
    </Box>
  )
}

export default AdminDashboard
