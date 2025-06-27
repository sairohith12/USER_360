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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import api from 'api/axios'

type AccessModule = {
  id: number
  name: string
  modules: {
    id: number
    name: string
    access_type: string
  }[]
}

type SubItem = {
  label: string
  identifier: string
}

type AllModule = {
  label: string
  identifier: string
  subItems: SubItem[]
}

type AccessStatus = Record<string, Record<string, boolean>>

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
    subItems: [
      { label: 'Neucoins', identifier: 'Neu Coins' },
      { label: 'GiftCard (Taj Experience)', identifier: 'Gift Card' },
      { label: 'Vouchers', identifier: 'Vouchers' },
    ],
  },
  {
    label: 'CC Avenue',
    identifier: 'CC Avenue',
    subItems: [
      { label: 'Payments', identifier: 'payment' },
      {
        label: 'Refunds',
        identifier: 'refunds',
      },
    ],
  },
]

const AccessControl = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [permissions, setPermissions] = useState<AccessStatus>({})
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedProperty, setSelectedProperty] = useState<string>('ALL')
  const [filteredUsers, setFilteredUsers] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [fetchDataError, setFetchDataError] = useState()
  const selectedUser = filteredUsers[selectedTab] || null
  const [modulesData, setModuleData] = useState<any>()

  function mapAccess(allModules: AllModule[], apiModules: AccessModule[]): AccessStatus {
    const accessStatus: AccessStatus = {}

    for (const mod of allModules) {
      accessStatus[mod.identifier] = {}

      for (const sub of mod.subItems) {
        let isEnabled = false

        if (mod.identifier === 'CC Avenue') {
          // SPECIAL CASE: parent = 'CC Avenue', sub = 'payment' or 'refunds'
          const matchedApiModule = apiModules.find(
            (api) => api.name.toLowerCase() === sub.identifier.toLowerCase(),
          )

          if (matchedApiModule) {
            const matchSub = matchedApiModule.modules.find(
              (m) => m.name.toLowerCase() === 'cc avenue',
            )
            isEnabled =
              (!!matchSub && matchSub.access_type === 'W') ||
              (!!matchSub && matchSub.access_type === 'R')
          }
        } else {
          // Normal case
          const matchedApiModule = apiModules.find(
            (api) => api.name.toLowerCase() === mod.label.toLowerCase(),
          )

          if (matchedApiModule) {
            const matchSub = matchedApiModule.modules.find(
              (m) => m.name.toLowerCase() === sub.identifier.toLowerCase(),
            )
            isEnabled =
              (!!matchSub && matchSub.access_type === 'W') ||
              (!!matchSub && matchSub.access_type === 'R')
          }
        }
        accessStatus[mod.identifier][sub.identifier] = isEnabled
      }
    }

    return accessStatus
  }

  useEffect(() => {
    if (selectedUser?.access?.services) {
      const normalized = mapAccess(allModules, selectedUser?.access?.services)
      setPermissions(normalized)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser])

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
          setFilteredUsers(
            userData?.data?.usersData?.flatMap(({ user, access }: { user: any; access: any[] }) =>
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

  const fetchModuleData = async () => {
    setLoading(true)
    let allData
    try {
      allData = await api.get('admin/allDetails', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (allData?.status === 200) {
        if (allData?.data) {
          setModuleData(allData?.data?.data)
        }
      }
    } catch (error) {
      setFetchDataError(
        (error as any)?.response?.message ||
          (error as any)?.message ||
          'Error Occurecd while fetching the module data ',
      )
      return
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchUserData()
    fetchModuleData()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      const results = filteredUsers?.filter((user: any) =>
        user?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(results)
      setSelectedTab(0)
    }, 200)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    const results = filteredUsers?.filter((user: any) => {
      const matchesName =
        user?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProperty =
        selectedProperty === 'ALL' || user?.access?.property?.hotel_name === selectedProperty
      return matchesName && matchesProperty
    })
    setFilteredUsers(results)
    setSelectedTab(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedProperty])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const handleTogglePermission = (moduleId: string, subId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [subId]: !prev[moduleId][subId],
      },
    }))
  }
  function convertToApiFormat(accessMap: AccessStatus): AccessModule[] {
    const result: AccessModule[] = []
    console.log(selectedUser, 'bolo777898989898', accessMap, permissions, modulesData)
    // Object.entries(accessMap).forEach(([moduleKey, subMap]) => {
    // if (moduleKey === 'CC Avenue') {
    //   Object.entries(subMap).forEach(([subKey, enabled], index) => {
    //     const existing = result.find((r) => r.name === subKey)
    //     if (existing) {
    //       existing.modules.push({
    //         id: 4,
    //         name: 'CC Avenue',
    //         access_type: enabled
    //           ? selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer'
    //             ? 'R'
    //             : 'W'
    //           : '',
    //       })
    //     } else {
    //       result.push({
    //         id: 0,
    //         name: subKey,
    //         modules: [
    //           {
    //             id: 4,
    //             name: 'CC Avenue',
    //             access_type: enabled
    //               ? selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer'
    //                 ? 'R'
    //                 : 'W'
    //               : '',
    //           },
    //         ],
    //       })
    //     }
    //   })
    //  } else {
    //     const submodules = Object.entries(subMap).map(([subKey, enabled], index) => ({
    //       id: index + 1,
    //       name: subKey,
    //       access_type: enabled
    //         ? selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer'
    //           ? 'R'
    //           : 'W'
    //         : '',
    //     }))
    //     result.push({
    //       id: 0,
    //       name: moduleKey,
    //       modules: submodules,
    //     })
    //   }
    // })

    return result
  }

  const handleSave = async () => {
    const serviceMap = modulesData?.service?.map((s: any) => [s?.name?.toLowerCase(), s?.id])

    const moduleMap = modulesData?.module?.map((m: any) => [m?.module_name, m?.id])
    const transformedAccess: any[] = []

    Object.entries(permissions).forEach(([serviceKey, serviceValue]: any) => {
      console.log(serviceValue, 'bolo457878898989', serviceKey)
      const serviceId = serviceMap.find(
        (item: any) => item[0]?.toLowerCase() === serviceKey?.toLowerCase(),
      )?.[1]
      if (serviceKey?.toLowerCase() === 'cc avenue') {
        Object.entries(serviceValue).forEach(([subKey, enabled], index) => {
          const moduleId = moduleMap.find(
            (item: any) => item[0]?.toLowerCase() === subKey?.toLowerCase(),
          )?.[1]
          console.log(
            serviceValue,
            'bolo457878898989',
            subKey,
            enabled,
            transformedAccess,
            moduleId,
          )

          const existing = transformedAccess.find((r) => r.name === subKey)
          if (existing) {
            // existing.modules.push({
            //   id: 4,
            //   name: 'CC Avenue',
            //   access_type: enabled
            //     ? selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer'
            //       ? 'R'
            //       : 'W'
            //     : '',
            // })
          } else {
            // result.push({
            //   id: 0,
            //   name: subKey,
            //   modules: [
            //     {
            //       id: 4,
            //       name: 'CC Avenue',
            //       access_type: enabled
            //         ? selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer'
            //           ? 'R'
            //           : 'W'
            //         : '',
            //     },
            //   ],
            // })
          }
        })
      } else {
        // if (serviceValue.enabled) {
        const serviceId = serviceMap.find(
          (item: any) => item[0]?.toLowerCase() === serviceKey?.toLowerCase(),
        )?.[1]

        Object.entries(serviceValue || {}).forEach(([moduleName, enabled]) => {
          console.log(serviceId, 'bolo7878898989', moduleName, enabled, moduleMap)
          if (enabled) {
            const moduleId = moduleMap.find(
              (item: any) => item[0]?.toLowerCase() === moduleName?.toLowerCase(),
            )?.[1]
            console.log(serviceId, moduleId, 'bolo2323889')
            if (moduleId && serviceId) {
              transformedAccess.push({
                module_id: moduleId,
                service_id: serviceId,
                access:
                  selectedUser?.access?.propertyRole?.name?.toLowerCase() === 'viewer' ? 'R' : 'W',
              })
            }
          }
        })
      }
      // }
    })

    const apiPayload = {
      userId: selectedUser?.user?.id,
      accessList: [
        {
          propertyRole_id: selectedUser?.access?.propertyRole?.id,
          hotel_code: selectedUser?.access?.property?.hotel_code,
          access: transformedAccess,
        },
      ],
    }

    // let createUserDataAccess
    // try {
    //   createUserDataAccess = await api.post('admin/access', apiPayload, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   if (createUserDataAccess?.status === 200) {
    //     setNewUserData(createUserDataAccess?.data?.data)
    //     // setPermissions({})
    //     setSnackbarOpen(true)
    //   }
    // } catch (error) {
    //   setFetchDataError(
    //     (error as any)?.response?.message ||
    //       (error as any)?.message ||
    //       'An error occurred while creating user',
    //   )
    //   return
    // }
  }
  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ bgcolor: 'primary.main', p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Title */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={700} color="primary.contrastText">
              Access Control Management Dashboard
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
                <MenuItem value="">All</MenuItem>
                {[
                  ...new Map(
                    filteredUsers?.map((u: any) => [
                      u.access.property.hotel_name,
                      u.access.property,
                    ]),
                  ).values(),
                ]?.map((prop: any, idx) => (
                  <MenuItem key={idx} value={prop.hotel_name}>
                    {prop.hotel_name}
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
            >
              <Box
                sx={{
                  minWidth: '30vw',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  borderRight: 1,
                  borderColor: 'divider',
                  backgroundColor: selectedTab ? '#dde3ed' : 'background.paper',
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Role</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Property</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user: any, index: number) => {
                      const isSelected = selectedTab === index
                      return (
                        <TableRow
                          key={index}
                          hover
                          selected={isSelected}
                          onClick={() => setSelectedTab(index)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>
                            {user?.user?.firstName + ' ' + user?.user?.lastName}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user?.access?.propertyRole?.name?.toUpperCase()}
                              size="small"
                              color={
                                user?.access?.propertyRole?.name?.toLowerCase() === 'admin'
                                  ? 'primary'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>{user?.access?.property?.hotel_name}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Box>
              {/* ))} */}
            </Tabs>
          </Box>
          {/* Selected User Details */}
          <Box sx={{ flexGrow: 1, p: 2 }}>
            {filteredUsers?.map((user: any, index: any) => (
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
                        {selectedUser?.user?.firstName + selectedUser?.user?.lastName}
                      </Box>{' '}
                      (
                      {selectedUser?.access?.propertyRole?.name?.charAt(0).toUpperCase() +
                        selectedUser?.access?.propertyRole?.name?.slice(1)}
                      ){' - '}
                      <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {selectedUser?.access?.property?.hotel_name}
                      </Box>{' '}
                    </Typography>
                    <Grid container spacing={2}>
                      {allModules?.map(({ label, identifier, subItems }) => (
                        <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Card elevation={1}>
                            <CardContent>
                              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                {label}
                              </Typography>
                              {subItems?.map((sub) => {
                                return (
                                  <Box
                                    key={sub?.identifier}
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
                                    <Typography variant="body1">{sub?.label}</Typography>
                                    <Switch
                                      color="primary"
                                      edge="end"
                                      checked={
                                        permissions?.[identifier]?.[sub?.identifier] ?? false
                                      }
                                      onChange={() =>
                                        handleTogglePermission(identifier, sub?.identifier)
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
