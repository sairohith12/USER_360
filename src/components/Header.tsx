// components/Header.tsx
import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  Theme,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth, UserType } from '@/context/authContext'

interface Props {
  onMenuClick: () => void
}

const Header: React.FC<Props> = ({ onMenuClick }) => {
  const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
  const { userType, isLoggedIn, login, logout, user } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

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
              style={{ marginLeft: '0.5vw' }}
            />
            <Typography fontSize={'0.7rem'} sx={{ fontFamily: 'var(--font-inter)' }}>
              {'Indian Hotels Company Limited'}
            </Typography>
            {/* <Typography
              variant="h3"
              sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 600, marginLeft: '10px' }}
            >
              {'IHCL'}
            </Typography>
             */}
          </Link>
        </Box>

        {isDesktop && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} href="/">
              Home
            </Button>
            {/* <Button color="inherit" component={Link} href="/about">
              About
            </Button> */}
            <Button color="inherit" component={Link} href="/contact">
              Contact
            </Button>
          </Box>
        )}

        <Box>
          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleMenuClick}>
                Login
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {/* {['admin', 'editor', 'viewer'].map((role) => (
                  <MenuItem
                    key={role}
                    onClick={() => {
                      login(role as UserType)
                      handleClose()
                    }}
                  >
                    Login as {user?.firstName + (role.charAt(0).toUpperCase() + role.slice(1))}
                  </MenuItem>
                ))} */}
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={logout}>
              Logout{' '}
              {user?.firstName + '_' + (userType.charAt(0).toUpperCase() + userType.slice(1))}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
