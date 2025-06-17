import React, { useEffect } from 'react'
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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/authContext'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

interface Props {
  onMenuClick: () => void
}

const Header: React.FC<Props> = ({ onMenuClick }) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { userType, logout, user, userSelectedProperty, setUserSelectedProperty } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
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

  useEffect(() => {
    if (!userSelectedProperty?.property?.hotel_name && user?.accessRecords?.length > 0) {
      setUserSelectedProperty(user?.accessRecords[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.accessRecords, userSelectedProperty])

  function formatRole(role: string) {
    return role
      ?.split('_')
      ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
      ?.join(' ')
  }

  return (
    <AppBar color="primary" elevation={4} sx={{ height: (theme) => theme.spacing(22) }}>
      <Toolbar
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
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
              <Image src="/logo/IHCL-LOGO-white.png" alt="Logo" width={90} height={35} priority />
              <Typography
                fontSize={'0.7rem'}
                sx={{ fontFamily: 'var(--font-inter)', mt: 0.5, color: '#ddd' }}
              >
                Indian Hotels Company Limited
              </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginRight: 10 }}>
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

          {/* User Menu */}
          <IconButton onClick={handleMenuClick} color="inherit" sx={{ ml: 1 }}>
            <AccountCircleIcon fontSize="large" />
            <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
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
                {(user?.firstName ? user?.firstName : ' ') +
                  ' ' +
                  (user?.lastName ? user?.lastName : '')}
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
  )
}

export default Header
