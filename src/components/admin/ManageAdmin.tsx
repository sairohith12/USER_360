import React, { useState } from 'react'
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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Pagination,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'

interface UserAccess {
  [module: string]: string[]
}

interface NewUser {
  name: string
  email: string
  employeeId: string
  property: string
  role: string
  status: string
  access: UserAccess
}

const mockUsers = [
  {
    name: 'Amit Verma',
    email: 'amit.verma@example.com',
    property: 'The Grand Palace',
    employeeId: 'EMP001',
    status: 'Active',
    access: {
      Redemption: ['Neucoins', 'GiftCard (Taj Experience)'],
      'Re-Instate': ['Neucoins', 'Vouchers'],
      'CC Avenue': ['Payments'],
    },
  },
  {
    name: 'Nina Rao',
    email: 'nina.rao@example.com',
    property: 'Taj Bangalore',
    employeeId: 'EMP0045',
    status: 'Inactive',
    access: {
      Redemption: ['Vouchers'],
      'CC Avenue': ['Refunds'],
    },
  },
]

const allModules = [
  {
    label: 'Redemption',
    subItems: ['Neucoins', 'GiftCard (Taj Experience)', 'Vouchers'],
  },
  {
    label: 'Re-Instate',
    subItems: ['Neucoins', 'GiftCard (Taj Experience)', 'Vouchers'],
  },
  {
    label: 'CC Avenue',
    subItems: ['Payments', 'Refunds'],
  },
]

const ManageAdmins = () => {
  const theme = useTheme()
  const [users, setUsers] = useState(mockUsers)
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [propertyFilter, setPropertyFilter] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 5
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    employeeId: '',
    property: '',
    role: 'admin',
    status: 'Active',
    access: {
      Redemption: [],
      'Re-Instate': [],
      'CC Avenue': [],
    },
  })

  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || user.status === statusFilter) &&
      (!propertyFilter || user.property === propertyFilter)
    )
  })

  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const handleToggleModuleAccess = (module: string, subItem: string): void => {
    setNewUser((prev: NewUser) => {
      const access: UserAccess = { ...prev.access }
      if (!access[module]) access[module] = []
      if (access[module].includes(subItem)) {
        access[module] = access[module].filter((item) => item !== subItem)
        if (access[module].length === 0) delete access[module]
      } else {
        access[module].push(subItem)
      }
      return { ...prev, access }
    })
  }

  const handleAddUser = () => {
    setUsers([...users, { ...newUser, id: Date.now() }])
    setNewUser({
      name: '',
      email: '',
      employeeId: '',
      property: '',
      role: 'admin',
      status: 'Active',
      access: {
        Redemption: [],
        'Re-Instate': [],
        'CC Avenue': [],
      },
    })
    setOpen(false)
  }

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
                >
                  <MenuItem value="">All</MenuItem>
                  {[...new Set(users.map((u) => u.property))].map((prop, idx) => (
                    <MenuItem key={idx} value={prop}>
                      {prop}
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

        {paginatedUsers.map((user, index) => (
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
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Name</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main }}
                      fontWeight={700}
                    >
                      {user.name}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Email</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main, wordBreak: 'break-word' }}
                      fontWeight={700}
                    >
                      {user.email}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Property</Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme?.palette?.primary?.main }}
                      fontWeight={700}
                    >
                      {user.property}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="subtitle2">Status</Typography>
                    <Chip
                      label={user.status}
                      color={user.status === 'Active' ? 'success' : 'default'}
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
                        .flatMap((m) => m.subItems)
                        .map((label, idx) => (
                          <TableCell key={idx} align="center">
                            {label}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allModules.map((module, mIdx) => (
                      <TableRow key={mIdx}>
                        <TableCell>{module.label}</TableCell>
                        {allModules
                          .flatMap((m) => m.subItems)
                          .map((subItem, sIdx) => (
                            <TableCell key={sIdx} align="center">
                              {(user.access as Record<string, string[]>)[module.label]?.includes(
                                subItem,
                              )
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

        {/* <Box textAlign="right" mt={4}>
          <Button variant="contained" color="primary">
            + Add New Admin
          </Button>
        </Box> */}
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                fullWidth
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                fullWidth
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Employee ID"
                fullWidth
                value={newUser.employeeId}
                onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Property"
                fullWidth
                value={newUser.property}
                onChange={(e) => setNewUser({ ...newUser, property: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Role"
                fullWidth
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                {['admin', 'editor', 'viewer', 'super_admin'].map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box mt={3}>
            <Typography variant="h6">Module Access</Typography>
            {allModules.map((module) => (
              <Box key={module.label} mt={2}>
                <Typography fontWeight={600}>{module.label}</Typography>
                <Grid container spacing={1} mt={1}>
                  {module.subItems.length > 0 ? (
                    module.subItems.map((sub) => (
                      <Grid key={sub}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                (newUser.access as UserAccess)[module.label]?.includes(sub) || false
                              }
                              onChange={() => handleToggleModuleAccess(module.label, sub)}
                            />
                          }
                          label={sub}
                        />
                      </Grid>
                    ))
                  ) : (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!(newUser.access as UserAccess)[module.label]}
                          onChange={() => handleToggleModuleAccess(module.label, module.label)}
                        />
                      }
                      label={module.label}
                    />
                  )}
                </Grid>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddUser}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageAdmins
