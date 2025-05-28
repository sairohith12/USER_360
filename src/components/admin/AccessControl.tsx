import React, { useState, useEffect } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Switch,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface User {
  id: string
  name: string
  role: 'admin' | 'viewer'
  propertyName: string
}

interface MenuItem {
  label: string
  subItems: string[]
}

const menuItems: MenuItem[] = [
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

// Mock existing users
const existingUsers: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: `u${index + 1}`,
  name: `User  ${index + 1}`,
  role: index % 2 === 0 ? 'admin' : 'viewer',
  propertyName: index % 2 === 0 ? 'The Grand Palace' : 'Taj Bangalore',
}))

type Permissions = {
  [userId: string]: {
    [module: string]: {
      [subItem: string]: boolean
    }
  }
}

const AccessControl = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [permissions, setPermissions] = useState<Permissions>({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<string>('ALL')
  const [filteredUsers, setFilteredUsers] = useState<User[]>(existingUsers)
  const propertyNames = ['ALL', ...Array.from(new Set(existingUsers.map((u) => u.propertyName)))]

  // Initialize permissions state
  useEffect(() => {
    const initialPermissions: Permissions = {}
    existingUsers.forEach((user) => {
      initialPermissions[user.id] = {}
      menuItems.forEach(({ label, subItems }) => {
        initialPermissions[user.id][label] = {}
        subItems.forEach((sub) => {
          initialPermissions[user.id][label][sub] = false
        })
      })
    })
    setPermissions(initialPermissions)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      const results = existingUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(results)
      setSelectedTab(0)
    }, 200)

    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    const initialPermissions: Permissions = {}
    existingUsers.forEach((user) => {
      initialPermissions[user.id] = {}
      menuItems.forEach(({ label, subItems }) => {
        initialPermissions[user.id][label] = {}
        subItems.forEach((sub) => {
          // Give random true/false for variety
          initialPermissions[user.id][label][sub] = Math.random() > 0.5
        })
      })
    })
    setPermissions(initialPermissions)
  }, [])

  useEffect(() => {
    const results = existingUsers.filter((user) => {
      const matchesName = user.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProperty = selectedProperty === 'ALL' || user.propertyName === selectedProperty
      return matchesName && matchesProperty
    })
    setFilteredUsers(results)
    setSelectedTab(0)
  }, [searchQuery, selectedProperty])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const selectedUser = filteredUsers[selectedTab] || null

  const handleTogglePermission = (userId: string, moduleLabel: string, subItemLabel: string) => {
    setPermissions((prev) => {
      const userPerms = prev[userId] ?? {}
      const modulePerms = userPerms[moduleLabel] ?? {}
      const currentVal = modulePerms[subItemLabel] ?? false

      return {
        ...prev,
        [userId]: {
          ...userPerms,
          [moduleLabel]: {
            ...modulePerms,
            [subItemLabel]: !currentVal,
          },
        },
      }
    })
  }

  const handleSave = () => {
    setSnackbarOpen(true)
    // Here you can implement real saving logic, e.g. API call
  }

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ flexGrow: 1 }}>
          Access Control Management Dashboard (Super Admin)
        </Typography>
        <TextField
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.contrastText' }} />
              </InputAdornment>
            ),
            sx: {
              color: 'primary.contrastText',
              '& .MuiInputBase-input': {
                color: 'primary.contrastText',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
            },
          }}
          variant="outlined"
          sx={{ width: 220 }}
        />
      </Box> */}

      <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={700} color="primary.contrastText">
              Access Control Management Dashboard (Super Admin)
            </Typography>
          </Grid>

          {/* Search */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'primary.contrastText' }} />
                  </InputAdornment>
                ),
                sx: {
                  color: 'primary.contrastText',
                  '& .MuiInputBase-input': {
                    color: 'primary.contrastText',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                },
              }}
              variant="outlined"
            />
          </Grid>

          {/* Property Filter */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl size="small" fullWidth>
              <InputLabel sx={{ color: 'primary.contrastText' }}>Property</InputLabel>
              <Select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                label="Property"
                sx={{
                  color: 'primary.contrastText',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }}
              >
                <MenuItem value="">All Properties</MenuItem>
                {propertyNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredUsers?.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="Vertical user tabs"
              sx={{
                borderRight: 1,
                borderColor: 'divider',
                minWidth: 320,
                maxHeight: '80vh',
                overflowY: 'auto',
                backgroundColor: selectedTab ? 'red' : 'background.paper',
              }}
            >
              {filteredUsers.map((user) => (
                <Tab
                  key={user.id}
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography noWrap>{user.name}</Typography>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        sx={{ height: 24, fontWeight: 600 }}
                      />
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {user.propertyName}
                      </Typography>
                    </Stack>
                  }
                  id={`user-tab-${user.id}`}
                  aria-controls={`user-tabpanel-${user.id}`}
                  wrapped
                  sx={{ alignItems: 'flex-start' }}
                />
              ))}
            </Tabs>
          </Box>
          {/* Selected User Details */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            {filteredUsers.map((user, index) => (
              <Box
                key={user.id}
                role="tabpanel"
                hidden={selectedTab !== index}
                id={`user-tabpanel-${user.id}`}
                aria-labelledby={`user-tab-${user.id}`}
              >
                {selectedUser && (
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflowY: 'auto',
                      p: 3,
                      backgroundColor: 'grey.50',
                      minHeight: 0,
                    }}
                    role="tabpanel"
                    id={`user-tabpanel-${selectedUser.id}`}
                    aria-labelledby={`user-tab-${selectedUser.id}`}
                  >
                    <Typography variant="h6" mb={2}>
                      Permissions for{' '}
                      <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {selectedUser.name}
                      </Box>{' '}
                      ({selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)})
                    </Typography>

                    <Grid container spacing={2}>
                      {menuItems.map(({ label, subItems }) => (
                        <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Card elevation={1}>
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                {label}
                              </Typography>
                              {subItems.map((sub) => {
                                const checked =
                                  permissions[selectedUser.id]?.[label]?.[sub] ?? false
                                console.log(permissions[selectedUser.id], 'bolo8888', checked)
                                return (
                                  <Box
                                    key={sub}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mb: 1,
                                      py: 0.5,
                                      px: 1,
                                      borderRadius: 1,
                                      backgroundColor: 'background.paper',
                                      boxShadow: 1,
                                    }}
                                  >
                                    <Typography variant="body1">{sub}</Typography>
                                    <Switch
                                      color="primary"
                                      edge="end"
                                      checked={checked}
                                      onChange={() =>
                                        handleTogglePermission(selectedUser.id, label, sub)
                                      }
                                      inputProps={{
                                        'aria-label': `Permission toggle for ${label} / ${sub} for user ${selectedUser.name}`,
                                      }}
                                    />
                                  </Box>
                                )
                              })}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Box mt={4} display="flex" justifyContent="flex-end">
                      <Button variant="contained" color="primary" size="large" onClick={handleSave}>
                        Save All Changes
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Permissions saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default AccessControl
