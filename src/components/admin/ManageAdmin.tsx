import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import api from 'api/axios'
import ClearIcon from '@mui/icons-material/Clear'
import AddAdminModal from './AddAdminModal'

interface UserAccess {
  [module: string]: string[]
}

const allModules = [
  {
    label: 'Redemption',
    identifier: 'redemption',
    subItems: [
      { label: 'Neucoins', identifier: 'Neu Coins' },
      { label: 'GiftCard (Taj Experience)', identifier: 'Gift Card' },
      { label: 'Vouchers', identifier: 'Vouchers' },
    ],
  },
  {
    label: 'Re-Instate',
    identifier: 're-instate',
    subItems: [],
  },
  {
    label: 'Payments',
    identifier: 'payment',
    subItems: [{ label: 'CC Avenue', identifier: 'CC Avenue' }],
  },
  {
    label: 'Refunds',
    identifier: 'refunds',
    subItems: [],
  },
]

const ManageAdmins = () => {
  const theme = useTheme()
  const [users, setUsers] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 5
  const [loading, setLoading] = useState(false)
  const [fetchDataError, setFetchDataError] = useState()

  const fetchUserData = async () => {
    setLoading(true)
    let userData
    try {
      userData = await api.get('admin/usersAccess', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (userData?.status === 200) {
        if (userData?.data?.usersData?.length > 0) {
          setUsers(
            userData?.data?.usersData?.flatMap(({ user, access }) =>
              access.map((a: any) => ({ user, access: a })),
            ),
          )
        }
      }
    } catch (error) {
      setFetchDataError(
        (error as any)?.response?.message ||
          (error as any)?.message ||
          'Error Occurecd while fetching the user data ',
      )
      return
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const filteredUsers = users?.filter((user: any) => {
    return (
      (user?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        user?.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.user?.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || user?.user?.status === statusFilter) &&
      (!propertyFilter || user?.access?.property?.hotel_name === propertyFilter)
    )
  })

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Manage Admins
      </Typography>

      <Paper sx={{ mt: 4, p: 3, borderRadius: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Admin Access Overview
        </Typography>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Property</InputLabel>
                <Select
                  value={propertyFilter}
                  label="Property"
                  onChange={(e) => setPropertyFilter(e.target.value)}
                  endAdornment={
                    propertyFilter ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setPropertyFilter('')}
                          edge="end"
                          aria-label="clear selection"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  {[
                    ...new Map(
                      users?.map((u: any) => [u.access.property.hotel_name, u.access.property]),
                    ).values(),
                  ].map((prop: any, idx) => (
                    <MenuItem key={idx} value={prop.hotel_name}>
                      {prop.hotel_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
              >
                Add New Admin
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {paginatedUsers.map((user: any, index: any) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={
                <Button
                  endIcon={<ArrowDropDownIcon />}
                  variant="contained"
                  size="small"
                  sx={{
                    paddingX: 4,
                    paddingY: 1.2,
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  View Matrix
                </Button>
              }
            >
              <Box sx={{ width: '100%' }}>
                <Grid container spacing={2} alignItems="center" wrap="wrap">
                  <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main }}
                      fontWeight={700}
                    >
                      {user?.user?.firstName + ' ' + user?.user?.lastName}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main, wordBreak: 'break-word' }}
                      fontWeight={700}
                    >
                      {user?.user?.email}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Property Name</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main }}
                      fontWeight={700}
                    >
                      {user?.access?.property?.hotel_name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
                    <Typography variant="subtitle2">Role</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main }}
                      fontWeight={700}
                    >
                      {user?.access?.propertyRole?.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip
                      label={user?.user?.status || 'Active'}
                      color={'success'}
                      // color={user?.user?.status?.toLowerCase() === 'active' ? 'success' : 'default'}
                    />
                  </Grid>
                </Grid>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Module</strong>
                      </TableCell>
                      {allModules
                        ?.flatMap((m) => m?.subItems)
                        ?.map((label, idx) => (
                          <TableCell key={idx} align="center">
                            {label?.label}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allModules?.map((module, mIdx) => (
                      <TableRow key={mIdx}>
                        <TableCell>{module.label}</TableCell>
                        {allModules
                          ?.flatMap((m) => m?.subItems)
                          ?.map((subItem, sIdx) => (
                            <TableCell key={sIdx} align="center">
                              {user?.access?.services
                                ?.find(
                                  (s: any) =>
                                    s.name?.toLowerCase() === module?.identifier?.toLowerCase(),
                                )
                                ?.modules?.some((m: any) => m?.name === subItem?.identifier)
                                ? '✅'
                                : '—'}
                            </TableCell>
                          ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredUsers.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>
      <AddAdminModal onClose={() => setOpen(false)} open={open} />
    </Box>
  )
}

export default ManageAdmins
