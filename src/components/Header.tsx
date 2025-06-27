// components/Header.tsx
import React, { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  Theme,
  MenuItem,
  Typography,
  FormControl,
  Select,
  SelectChangeEvent,
  Menu,
  Divider,
  ListItem,
  ListItemButton,
  List,
  ListItemText,
  Drawer,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/authContext'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  onMenuClick: () => void
}

const Header: React.FC<Props> = ({ onMenuClick }) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const { userType, logout, user, userSelectedProperty, setUserSelectedProperty } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = user?.accessRecords.find(
      (item: any) => item.property.hotel_name === event.target.value,
    )
    setUserSelectedProperty(selected || null)
  }

  const handleHotelSelect = (hotelName: string) => {
    const selected = user?.accessRecords.find((item: any) => item.property.hotel_name === hotelName)
    setUserSelectedProperty(selected || null)
    setDrawerOpen(false)
  }

  useEffect(() => {
    if (!userSelectedProperty?.property?.hotel_name && user?.accessRecords?.length > 0) {
      setUserSelectedProperty(user?.accessRecords[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accessRecords, userSelectedProperty])

  const formatRole = (role: string) =>
    role
      ?.split('_')
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(' ')

  return (
    <>
      <AppBar color="primary" elevation={4} sx={{ height: (theme) => theme.spacing(22) }}>
        <Toolbar
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            px: isDesktop ? 3 : 1.5,
            gap: isDesktop ? 0 : 1,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isDesktop && (
              <IconButton color="inherit" edge="start" onClick={onMenuClick}>
                <MenuIcon />
              </IconButton>
            )}
            <Link href="/" passHref>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                <Image
                  src="/logo/IHCL-LOGO-white.png"
                  alt="Logo"
                  width={isDesktop ? 90 : 60}
                  height={isDesktop ? 35 : 25}
                  priority
                />
                {!isMobile && (
                  <Typography
                    fontSize="0.7rem"
                    sx={{ fontFamily: 'var(--font-inter)', mt: 0.5, color: '#ddd' }}
                  >
                    Indian Hotels Company Limited
                  </Typography>
                )}
              </Box>
            </Link>
          </Box>

          {/* {isDesktop && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            <Button color="inherit" component={Link} href="/contact">
              Contact
            </Button>
          </Box>
        )} */}

          {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {user?.accessRecords?.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="property-select-label" sx={{ color: '#fff' }}>
                Selected Property
              </InputLabel>
              <Select
                labelId="property-select-label"
                value={userSelectedProperty?.property.hotel_name || ''}
                label="Selected Property"
                onChange={handleChange}
                sx={{
                  backgroundColor: '#fff',
                  '& .MuiSelect-select': {
                    color: '#000',
                  },
                }}
              >
                {user?.accessRecords.map((item: any) => (
                  <MenuItem key={item.property.id} value={item.property.hotel_name}>
                    {item.property.hotel_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {isLoggedIn ? (
            <Box textAlign="right">
              <Button
                color="inherit"
                size="small"
                sx={{ mt: 0.5, textTransform: 'none' }}
                onClick={logout}
              >
                Logout
              </Button>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.firstName ?? 'Guest'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#ddd', fontStyle: 'italic' }}>
                {(userType ?? '').charAt(0).toUpperCase() + (userType ?? '').slice(1)}
              </Typography>
            </Box>
          ) : (
            <Button color="inherit" onClick={handleMenuClick}>
              Login
            </Button>
          )}
        </Box> */}

          {/* Right Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: isDesktop ? 2.5 : 1,
              ml: isDesktop ? 0 : 0.5,
            }}
          >
            {isDesktop ? (
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <Select
                  value={userSelectedProperty?.property?.hotel_name || ''}
                  onChange={handleChange}
                  startAdornment={
                    <Box component="span" sx={{ mr: 1, fontWeight: 600 }}>
                      🏨
                    </Box>
                  }
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    fontWeight: 500,
                    boxShadow: 1,
                    '& .MuiSelect-select': {
                      color: '#000',
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  displayEmpty
                  renderValue={(selected) =>
                    selected || <span style={{ color: '#888' }}>Choose Hotel</span>
                  }
                >
                  {user?.accessRecords.map((item: any) => (
                    <MenuItem key={item.property.id} value={item.property.hotel_name}>
                      {item.property.hotel_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => setDrawerOpen(true)}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#000',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ overflow: 'hidden', flex: 1 }}
                  >
                    <Box component="span" sx={{ fontSize: '1rem' }}>
                      🏨
                    </Box>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {userSelectedProperty?.property?.hotel_name || 'Select Hotel'}
                    </Typography>
                  </Box>
                  <KeyboardArrowDownIcon fontSize="small" />
                </Button>

                {/* Drawer for hotel selection on mobile */}

                <Drawer
                  anchor="bottom"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  PaperProps={{
                    sx: {
                      height: '100vh',
                      borderRadius: 0,
                      px: 3,
                      pt: 3,
                      pb: 4,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={600}>
                      Select Property
                    </Typography>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Box flex={1} overflow="auto">
                    <List>
                      {user?.accessRecords.map((item: any) => {
                        const isSelected =
                          item.property.hotel_name === userSelectedProperty?.property?.hotel_name
                        return (
                          <ListItem key={item.property.id} disablePadding>
                            <ListItemButton
                              selected={isSelected}
                              onClick={() => handleHotelSelect(item.property.hotel_name)}
                              sx={{
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: isSelected ? '#e0ebf9' : undefined,
                                '&.Mui-selected': {
                                  backgroundColor: '#e0ebf9 !important',
                                },
                              }}
                            >
                              <ListItemText
                                primary={item.property.hotel_name}
                                primaryTypographyProps={{
                                  fontWeight: isSelected ? 600 : 500,
                                  color: isSelected ? '#2e3b55' : 'text.primary',
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )
                      })}
                    </List>
                  </Box>
                </Drawer>
              </>
            )}

            {/* User Menu */}
            <IconButton onClick={handleMenuClick} color="inherit">
              <AccountCircleIcon fontSize="large" />
              <KeyboardArrowDownIcon fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  p: 2,
                  minWidth: 220,
                  borderRadius: 2,
                  boxShadow: 3,
                },
              }}
              transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {(user?.firstName ?? '') + ' ' + (user?.lastName ?? '')}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatRole(userType || '')}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Button fullWidth variant="contained" color="primary" size="small" onClick={logout}>
                  Logout
                </Button>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
