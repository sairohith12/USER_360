/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { Button, TextField, Typography, Box, InputAdornment } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import OTPComponent from '@/components/OTPComponent'
import Cookies from 'js-cookie'
import { useAuth } from '@/context/authContext'
import { useGuestContext } from '@/context/guestContext'

const Login = () => {
  const { login } = useAuth()
  const { journeyType, updatedJourneyType } = useGuestContext()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpModalOpen, setOtpModalOpen] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setEmailError('')
  }

  useEffect(() => {
    updatedJourneyType('login')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateEmail = () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format')
      return false
    }
    return true
  }

  const handleLogin = async () => {
    if (validateEmail()) {
      setLoading(true)
      setEmailError('')
      let responseData: any
      try {
        responseData = await login(email)
      } catch (err: unknown) {
        if (
          err instanceof Error &&
          'response' in err &&
          (err.response as { data?: { message?: string } })?.data?.message
        ) {
          setEmailError('You do not have authorization to access this portal.')
        } else {
          setEmailError('Login failed')
        }
      } finally {
        setLoading(false)
      }
      if (responseData?.status === 200) {
        setOtpModalOpen(true)
      }
    }
  }

  useEffect(() => {
    Cookies.remove('userType')
    localStorage.clear()
  }, [])

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {/* Background Image with blur */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/logo/taj_holiday_village_resort.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(3px)', // Apply blur effect only to the background
            zIndex: -1, // Ensure the background stays behind the content
          }}
        ></Box>

        {/* Content Box */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingX: 4,
            paddingY: 10,
            borderRadius: 2,
            width: '100%',
            maxWidth: '60vw',

            backgroundColor: 'rgb(229 218 218 / 80%)', // Transparent cream background for contrast
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Add subtle shadow
            '@media (max-width:480px)': {
              maxWidth: '90vw',
            },
          }}
        >
          <Box sx={{ flex: 1, display: { xs: 'none', sm: 'block' } }}>
            <img
              src="/logo/login_background.png"
              alt="Your Business"
              style={{ width: '100%', borderRadius: '8px', height: '100%' }}
            />
          </Box>
          <Box sx={{ flex: 1, padding: 2, textAlign: 'center' }}>
            <img
              src="/logo/user360_login_logo.png"
              alt="user 360"
              style={{ width: 200, borderRadius: '8px', height: '100%' }}
            />
            <Typography
              variant="h4"
              mb={3}
              textAlign="center"
              color="primary"
              sx={{ fontFamily: 'Cinzel', fontWeight: 'bold' }}
            >
              Welcome to User 360
            </Typography>
            <Typography variant="body2" align="center" sx={{ marginBottom: 4 }}>
              PLEASE ENTER YOUR EMAIL TO LOGIN
            </Typography>
            <TextField
              label="Business Email"
              variant="outlined"
              margin="normal"
              autoComplete="off"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'inherit',
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 'bold',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                marginTop: 2,
                borderRadius: '8px',
                fontWeight: 'bold',
                padding: '12px',
              }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Box>
      </Box>

      <OTPComponent open={otpModalOpen} onClose={() => setOtpModalOpen(false)} email={email} />
    </>
  )
}

Login.layout = 'none'
export default Login
