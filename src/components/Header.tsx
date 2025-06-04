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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/authContext'

interface Props {
  onMenuClick: () => void
}

const Header: React.FC<Props> = ({ onMenuClick }) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { userType, logout, user, userSelectedProperty, setUserSelectedProperty } = useAuth()
  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = user?.accessRecords.find(
      (item: any) => item.property.hotel_name === event.target.value,
    )
    setUserSelectedProperty(selected || null)
  }

  useEffect(() => {
    if (!userSelectedProperty && user?.accessRecords?.length > 0) {
      setUserSelectedProperty(user?.accessRecords[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelectedProperty])

  return (
    <AppBar color="primary" elevation={3} sx={{ height: (theme) => theme.spacing(22) }}>
      <Toolbar
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isDesktop && (
            <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Link href="/" passHref>
            <Image
              src="/logo/IHCL-LOGO-white.png"
              alt="Logo"
              width={90}
              height={35}
              priority={true}
              style={{ marginLeft: '0.5vw' }}
            />
            <Typography fontSize={'0.7rem'} sx={{ fontFamily: 'var(--font-inter)' }}>
              Indian Hotels Company Limited
            </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FormControl size="small" sx={{ minWidth: 300 }}>
            <Select
              value={userSelectedProperty?.property.hotel_name || ''}
              onChange={handleChange}
              startAdornment={
                <Box component="span" sx={{ mr: 1, fontWeight: 600 }}>
                  🏨
                </Box>
              }
              sx={{
                backgroundColor: '#fff',
                fontWeight: 500,
                '& .MuiSelect-select': {
                  color: '#000',
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

          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" fontWeight="bold">
              {user?.firstName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ccc' }}>
              {(userType ?? '').charAt(0).toUpperCase() + (userType ?? '').slice(1)}
            </Typography>
          </Box>
          <Button color="inherit" size="small" onClick={logout} variant="outlined">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
