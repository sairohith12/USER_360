import React, { useState } from 'react'

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  useTheme,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useGuestContext } from '@/context/guestContext' // Import useUserContext
import Image from 'next/image'
import { GCNumber, GCPin } from './constants'
import TextfieldValidator from '@/utils/validateMobile'
import GiftCardInfo from '../Redemption/GiftCardInfo'
import { convertString } from '@/utils/pathtoHeadingConverter'
import api from 'api/axios'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { formatDateToYYYYMMDD } from '@/utils/date'
import { keyframes } from '@mui/system'
import CircularProgress from '@mui/material/CircularProgress'

const fadeInSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

interface CardData {
  cardNumber: string
  cardPin: string
  balance: string
  cardType: string
  expiryDate: string
  status: 'Active' | 'Inactive' | 'Blocked' | 'Activated'
  cardFirstName?: string
  cardLastName?: string
}

const GiftCardDetails: React.FC = () => {
  const { guestLogin, journeyType } = useGuestContext() // Get login method from context
  const theme = useTheme() // Access the theme
  const [gcData, setGCData] = useState<CardData | null>()
  const [showPassword, setShowPassword] = useState(false)
  const [wrongMsg, setWrongMsg] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({
    [GCNumber]: '',
    [GCPin]: '',
  })
  const [ErrorMessage, setErrorMessage] = useState<{ [key: string]: string }>({
    [GCNumber]: '',
    [GCPin]: '',
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({
    [GCNumber]: false,
    [GCPin]: false,
  })

  // const formValidation = (isFormValid: boolean, id: string) => {
  //   setFormErrors({ ...formErrors, [id]: !isFormValid })
  // }

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWrongMsg('')
    setGCData(null)
    const { name, value } = event.target
    // const { status, errorMsg, fieldName } = TextfieldValidator(name, value)
    // setErrorMessage((prev: { [key: string]: string }) => {
    //   return {
    //     ...prev,
    //     [fieldName]: errorMsg,
    //   }
    // })
    setFormValues((prev: { [key: string]: string }) => {
      return {
        ...prev,
        [name]: value,
      }
    })
    // formValidation(status, name)
  }

  const fetchGCBalance = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    setLoading(true)
    setWrongMsg('')
    setGCData(null)
    const gcNumberValid = formValues?.[GCNumber]?.replace(/\s/g, '').trim()?.length === 16
    const gcPinValid = formValues?.[GCPin]?.trim()?.length === 6
    const { status: numberStatus, errorMsg: numberError } = TextfieldValidator(
      GCNumber,
      formValues?.[GCNumber],
    )
    const { status: pinStatus, errorMsg: pinError } = TextfieldValidator(GCPin, formValues?.[GCPin])
    setFormErrors({
      [GCNumber]: !numberStatus,
      [GCPin]: !pinStatus,
    })
    setErrorMessage({
      [GCNumber]: numberError,
      [GCPin]: pinError,
    })
    if (!gcNumberValid || !gcPinValid) {
      setLoading(false)
      return
    }
    try {
      const gcFetchData = await api.post('gc/balance-enquiry', {
        balanceEnquiry: [
          {
            CardNumber: formValues?.GCNumber?.replace(/\s/g, '').trim(),
            CardPin: formValues?.GCPin,
          },
        ],
      })

      if (gcFetchData?.data?.responseMessage === 'Validation Failed.') {
        setWrongMsg(gcFetchData?.data?.cards?.[0]?.responseMessage)
        return
      }

      if (gcFetchData?.data?.responseMessage === 'Transaction successful.') {
        const card = gcFetchData?.data?.cards?.[0]
        setGCData({
          cardNumber: formValues?.GCNumber,
          balance: card?.balance,
          cardType: card?.cardType,
          expiryDate: formatDateToYYYYMMDD(card?.expiryDate),
          status: card?.cardStatus,
          cardFirstName: card?.firstName,
          cardLastName: card?.lastName,
          cardPin: formValues?.GCPin,
        })
      }
    } catch (error) {
      setWrongMsg(error?.response?.data?.message || 'Error fetching gift card balance')
    } finally {
      setLoading(false)
    }
  }

  const handleCardNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWrongMsg('')
    setGCData(null)
    handleChangeForm(event)
    let CardNumber = event?.target?.value
    if (parseInt(CardNumber, 10) > 19) {
      CardNumber = CardNumber.substr(0, 19)
    }
    const inputVal = CardNumber?.replace(/ /g, '')
    let inputNumbersOnly = inputVal?.replace(/\D/g, '')
    if (inputNumbersOnly?.length >= 16) {
      inputNumbersOnly = inputNumbersOnly
        .replace(/[`~!$%^@*()_|+\\=?;:'"<>{}/\\[\]\\]/gi, '')
        .substr(0, 16)
    }
    const splits = inputNumbersOnly?.match(/.{1,4}/g)
    let spacedNumber = ''
    if (splits) {
      spacedNumber = splits?.join(' ')
    }
    if (spacedNumber.slice(0, 1) !== '0') {
      setFormValues((prev: { [key: string]: string }) => {
        return {
          ...prev,
          GCNumber: spacedNumber.trim(),
        }
      })
    }
  }

  // const showBalance = expiryDate || (balance !== null && String(balance));

  // const handleOTPVerified = () => {
  // Simulate user data after successful OTP verification
  // const userDetails = {
  //   firstName: "John",
  //   lastName: "Doe",
  //   neucoins: 5000,
  //   mobileNumber: mobileNumber,
  //   countryCode: countryCode,
  // };
  //   guestLogin(userDetails); // Update the context with user details
  // };

  const handleReset = () => {
    setGCData(null)
    setFormErrors({
      [GCNumber]: false,
      [GCPin]: false,
    })
    setWrongMsg('')
    setFormValues({
      [GCNumber]: '',
      [GCPin]: '',
    })
  }

  const handleRedeem = () => {
    guestLogin({
      cardNumber: gcData?.cardNumber?.replace(/\s/g, '').trim() || '',
      cardPin: gcData?.cardPin || '',
      balance: gcData?.balance || '',
      cardType: gcData?.cardType || '',
      expiryDate: gcData?.expiryDate || '',
      status: gcData?.status || '',
      firstName: gcData?.cardFirstName || '',
      lastName: gcData?.cardLastName || '',
    }) // Update the context with user details
  }

  return (
    <Box
      sx={{
        px: { xs: 0, sm: 3, md: 4 },
        py: { xs: 0, sm: 4, md: 4 },
        overflowY: 'auto',
        textAlign: 'center',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h2"
        sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
      >
        {convertString(journeyType)}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: theme.spacing(4),
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/*GiftCard Logo */}
        <Box sx={{ marginBottom: theme.spacing(3) }}>
          <Image src="/logo/qwikcilver_logo.png" alt="GiftCard Logo" width={280} height={60} />
        </Box>

        {/* Mobile Number Input Section */}
        <Paper
          sx={{
            animation: `${fadeInSlide} 0.4s ease-out`,
            padding: theme.spacing(3),
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            maxWidth: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              color: theme.palette.text.primary,
            }}
          >
            Enter Customer GiftCard Details
          </Typography>

          {/* GC Input */}
          <TextField
            label="GiftCard Number"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                // fontSize: "14px",
                // padding: "10px 14px",
                //  fontSize: theme.typography.body2.fontSize,
                padding: theme.spacing(1, 2),
                height: 56,
              },
            }}
            error={formErrors[GCNumber] && formValues[GCNumber].length < 19}
            helperText={
              formErrors[GCNumber] &&
              formValues[GCNumber].length > 0 &&
              formValues[GCNumber].length < 19 &&
              ErrorMessage[GCNumber]
            }
            autoComplete="off"
            name={GCNumber}
            value={formValues?.[GCNumber]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleCardNumber(e)
            }}
            placeholder="XXXX XXXX XXXX XXXX"
          />
          <TextField
            label="GiftCard Pin"
            variant="outlined"
            fullWidth
            name={GCPin}
            type={showPassword ? 'text' : 'password'} // Toggle between text and password
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                // fontSize: "14px",
                // padding: "10px 14px",
                //  fontSize: theme.typography.body2.fontSize,
                padding: theme.spacing(1, 2),
                height: 56,
              },
            }}
            error={formErrors[GCPin]}
            helperText={formErrors[GCPin] && formValues[GCPin].length > 0 && ErrorMessage[GCPin]}
            inputProps={{ maxLength: 6 }}
            value={isNaN(Number(formValues?.[GCPin])) ? '' : formValues?.[GCPin]}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              ;(e.target as HTMLInputElement).value = Math?.max(
                0,
                parseInt((e.target as HTMLInputElement)?.value),
              )
                ?.toString()
                ?.slice(0, 6)
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeForm(e)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {wrongMsg && (
            <Typography color="error" sx={{ mt: 1 }} align="center">
              {wrongMsg}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              // disabled={!(formValues?.GCNumber?.length === 19 && formValues?.GCPin?.length === 6)}
              disabled={loading}
              sx={{
                marginTop: theme.spacing(3),
                padding: theme.spacing(1.5, 3),
                fontSize: theme.typography.body1,
                fontWeight: 600,
                borderRadius: '50px',
                boxShadow: theme.shadows[3],
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                fetchGCBalance(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)
              }
              // disabled={!(formValues?.GCNumber?.length === 19 && formValues?.GCPin?.length === 6)}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{
                marginTop: theme.spacing(3),
                padding: theme.spacing(1.5, 3),
                fontSize: theme.typography.body1,
                fontWeight: 600,
                borderRadius: '50px',
                boxShadow: theme.shadows[3],
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              {loading ? 'Validating...' : 'Validate'}
            </Button>
          </Box>
        </Paper>
        {gcData && (
          <Box
            mt={4}
            sx={{
              animation: `${fadeInSlide} 0.4s ease-out`,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, color: '#2e3b55', fontWeight: 600 }}>
              GiftCard details
            </Typography>
            <GiftCardInfo {...gcData} isExpiryExtension={false} onRedeem={handleRedeem} />
          </Box>
        )}

        {/* <OTPComponent
        open={openOTPModal}
        onClose={() => setOpenOTPModal(false)}
        mobileNumber={formatMobileNumber(mobileNumber, countryCode)}
        onVerified={handleOTPVerified} // Update context on OTP verification
      /> */}
      </Box>
    </Box>
  )
}

export default GiftCardDetails
