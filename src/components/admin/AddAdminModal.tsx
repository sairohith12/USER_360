// Updated AddAdminModal.tsx with dynamic access per selected property

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Autocomplete,
  Box,
  Grid,
  MenuItem,
} from '@mui/material'
import api from 'api/axios'

interface Property {
  id: string
  hotel_name: string
  hotel_code: string
}

interface AccessMap {
  [hotel_code: string]: {
    propertyRole_id: string
    hotel_code: string
    access: {
      [moduleId: string]: {
        enabled: boolean
        subModules: {
          [subModuleId: string]: boolean
        }
      }
    }
  }
}

interface Props {
  open: boolean
  onClose: () => void
}

const menuItems = [
  {
    label: 'Redemption',
    identifier: 'redemption',
    children: [
      { label: 'Neucoins', identifier: 'Neu Coins' },
      { label: 'GiftCard (Taj Experience)', identifier: 'Gift Card' },
      { label: 'Vouchers', identifier: 'Vouchers' },
    ],
  },
  {
    label: 'Re-Instate',
    identifier: 're-instate',
    children: [
      { label: 'Neucoins', identifier: 'Neu Coins' },
      { label: 'GiftCard (Taj Experience)', identifier: 'Gift Card' },
      { label: 'Vouchers', identifier: 'Vouchers' },
    ],
  },
  {
    label: 'Payments',
    identifier: 'payment',
    children: [{ label: 'CC Avenue', identifier: 'CC Avenue' }],
  },
  {
    label: 'Refunds',
    identifier: 'refunds',
    children: [{ label: 'CC Avenue', identifier: 'CC Avenue' }],
  },
]

const AddAdminModal: React.FC<Props> = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [mobile, setMobile] = useState('')
  //   const [status, setStatus] = useState(true)
  const [loading, setLoading] = useState(false)
  const [allProperties, setAllProperties] = useState<any>([])
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])
  const [accessMap, setAccessMap] = useState<AccessMap>({})
  const [fetchPropertiesError, setFetchPropertiesError] = useState('')
  const [propertyRoles, setPropertyRoles] = useState<any>()
  const [modules, setModules] = useState<any>()
  const [createUserError, setCreateUserError] = useState()
  const [newUserData, setNewUserData] = useState<any>()
  const [allServices, setAllServices] = useState<any>()

  const clearData = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setEmployeeId('')
    setMobile('')
    setAccessMap({})
    setNewUserData({})
  }

  const fetchAllDetails = async () => {
    setLoading(true)
    let allServicesData
    try {
      allServicesData = await api.get('admin/allDetails', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (allServicesData?.status === 200) {
        setAllServices(allServicesData?.data?.data?.service)
        setPropertyRoles(allServicesData?.data?.data?.propertyRole)
        setModules(allServicesData?.data?.data?.module)
        setAllProperties(allServicesData?.data?.data?.property)
      }
    } catch (error) {
      setFetchPropertiesError(
        (error as any)?.response?.message ||
          (error as any)?.message ||
          'An error occurred while fetching services',
      )
      return
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyChange = (value: Property[]) => {
    setSelectedProperties(value)
    const newMap: AccessMap = {}
    value.forEach((prop) => {
      newMap[prop.hotel_code] = accessMap[prop.hotel_code] || {
        propertyRole_id: '',
        hotel_code: '',
        access: {},
      }
      newMap[prop.hotel_code].hotel_code = prop.hotel_code
    })

    setAccessMap(newMap)
  }
  const toggleModule = (hotel_code: string, moduleId: string, enabled: boolean) => {
    const updated = { ...accessMap }

    if (!updated[hotel_code])
      updated[hotel_code] = { propertyRole_id: '', hotel_code: '', access: {} }

    updated[hotel_code].access[moduleId] = {
      enabled,
      subModules: enabled ? updated[hotel_code]?.access[moduleId]?.subModules || {} : {},
    }

    setAccessMap(updated)
  }

  const toggleSubModule = (
    hotel_code: string,
    moduleId: string,
    subModuleId: string,
    checked: boolean,
  ) => {
    const updated = { ...accessMap }
    if (!updated[hotel_code]) return
    if (!updated[hotel_code].access[moduleId]) return
    updated[hotel_code].access[moduleId].subModules[subModuleId] = checked
    setAccessMap(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    let createUserData
    try {
      createUserData = await api.post(
        'auth/createUser',
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          employee_id: employeeId,
          roleId: 2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (createUserData?.status === 201) {
        setNewUserData(createUserData?.data?.user)

        const serviceMap = Object.fromEntries(
          allServices?.map((s: any) => [s?.name?.toLowerCase(), s?.id]),
        )
        const moduleMap = Object.fromEntries(modules?.map((m: any) => [m?.module_name, m?.id]))

        const transformedData = {
          userId: createUserData?.data?.user?.id,
          accessList: Object.values(accessMap)?.map((property) => {
            const transformedAccess: any[] = []

            Object.entries(property?.access).forEach(([serviceKey, serviceValue]: any) => {
              if (serviceValue.enabled) {
                const serviceId = serviceMap[serviceKey?.toLowerCase()]
                Object.entries(serviceValue.subModules || {}).forEach(([moduleName, enabled]) => {
                  if (enabled) {
                    const moduleId = moduleMap[moduleName]
                    if (moduleId && serviceId) {
                      transformedAccess.push({
                        module_id: moduleId,
                        service_id: serviceId,
                        access: 'R',
                      })
                    }
                  }
                })
              }
            })

            return {
              propertyRole_id: property.propertyRole_id,
              hotel_code: property.hotel_code,
              access: transformedAccess,
            }
          }),
        }
        let createUserDataAccess
        try {
          createUserDataAccess = await api.post('admin/access', transformedData, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (createUserDataAccess?.status === 200) {
            setNewUserData(createUserDataAccess?.data?.data)
            clearData()
            onClose()
          }
        } catch (error) {
          setCreateUserError(
            (error as any)?.response?.message ||
              (error as any)?.message ||
              'An error occurred while creating user',
          )
          return
        }
      }
    } catch (error) {
      setCreateUserError(
        (error as any)?.response?.data?.message ||
          (error as any)?.message ||
          'An error occurred while creating user',
      )
      return
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllDetails()
  }, [])
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Admin</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1.5}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="First Name*"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Last Name*"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Employee ID*"
              fullWidth
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email*"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Mobile*"
              fullWidth
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Grid>
        </Grid>
        {/* <FormControlLabel
          control={<Switch checked={status} onChange={() => setStatus(!status)} />}
          label="Active Status"
        /> */}
        <Autocomplete
          multiple
          options={allProperties}
          getOptionLabel={(option) => option?.hotel_name}
          value={selectedProperties}
          onChange={(e, value) => handlePropertyChange(value)}
          renderInput={(params) => (
            <TextField {...params} label="Select Properties*" margin="normal" />
          )}
        />

        {selectedProperties?.map((property) => (
          <Card key={property.hotel_code} sx={{ mt: 2 }}>
            <CardHeader title={property.hotel_name} />
            <Grid container spacing={2} ml={1}>
              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  label="Role*"
                  fullWidth
                  value={accessMap[property.hotel_code]?.propertyRole_id}
                  onChange={(e) => {
                    const updatedAccessMap = { ...accessMap }
                    if (updatedAccessMap[property.hotel_code]) {
                      updatedAccessMap[property.hotel_code].propertyRole_id = e.target.value
                      setAccessMap(updatedAccessMap)
                    }
                  }}
                >
                  {(propertyRoles || [])?.map((role: any) => (
                    <MenuItem key={role?.name} value={role?.id}>
                      {role?.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <CardContent>
              {menuItems?.map((module) => (
                <Box key={module.identifier} mb={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          accessMap[property.hotel_code]?.access?.[module?.identifier]?.enabled ||
                          false
                        }
                        onChange={(e) =>
                          toggleModule(property.hotel_code, module.identifier, e.target.checked)
                        }
                      />
                    }
                    label={<Typography variant="body1">{module.label}</Typography>}
                  />
                  {module?.children &&
                    accessMap[property.hotel_code]?.access?.[module.identifier]?.enabled && (
                      <Box ml={3}>
                        {module.children.map((child) => (
                          <FormControlLabel
                            key={child.identifier}
                            control={
                              <Checkbox
                                checked={
                                  accessMap[property.hotel_code]?.access?.[module.identifier]
                                    ?.subModules?.[child.identifier] || false
                                }
                                onChange={(e) =>
                                  toggleSubModule(
                                    property.hotel_code,
                                    module.identifier,
                                    child.identifier,
                                    e.target.checked,
                                  )
                                }
                              />
                            }
                            label={<Typography variant="body2">{child.label}</Typography>}
                          />
                        ))}
                      </Box>
                    )}
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </DialogContent>
      {createUserError && (
        <Typography color="error" sx={{ mt: 1 }} align="center">
          {createUserError}
        </Typography>
      )}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Admin
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAdminModal
