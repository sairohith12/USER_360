import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material'
import { useGuestContext } from '@/context/guestContext'
import Image from 'next/image'
import OTPComponent from '@/components/OTPComponent'
import TextfieldValidator, {
  formatMobileNumber,
  validateMobileNumber,
} from '@/utils/validateMobile'
import { JOURNEY_TYPES, MobilePhoneNumber } from './constants'
import FormInput from './FormInput'
import { convertString } from '@/utils/pathtoHeadingConverter'
import { getRecaptchaToken } from '@/utils/recaptcha'
import axios from 'axios'
import { GENERATE_NEUPASS_OTP } from '@/utils/apiConstants'
import api from 'api/axios'
import { PhoneInputWithCountrySelector } from './PhoneInputWithCountrySelector'

const ReceptionistDashboard: React.FC = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('')
  const [countryCode, setCountryCode] = useState<string>('+91')
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [apiData, setApiData] = useState<any>(null)
  const [inputMode, setInputMode] = useState<'mobile' | 'membership'>('mobile')
  const [memberShipNo, setMemberShipNo] = useState('')
  const [membership, setMembership] = useState<'epicure' | 'chambers' | 'hsbc'>('epicure')
  const [disable, setDisable] = useState(false)
  const [mobileError, setMobileError] = useState<string>('')

  const { guestLogin, journeyType, updateGuestVouchers } = useGuestContext()

  const handleMobileNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setMobileNumber(value)
    setErrorMessage('')
    const { status, errorMsg } = TextfieldValidator(name, value, { countryCode })
    if (status) {
      setErrorMessage('')
    } else if (isSubmitted) {
      setErrorMessage(errorMsg)
    }
  }

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    setCountryCode(event.target.value)
    setErrorMessage('')
  }

  const handleGenerateOTP = async () => {
    setIsSubmitted(true)

    if (inputMode === 'mobile') {
      if (errorMessage?.length > 0) {
        return
      }
    } else {
      const isValid = membership.toLowerCase().includes('chambers')
        ? memberShipNo.length >= 4
        : memberShipNo.length === 12 || memberShipNo.length === 16

      if (!isValid) {
        setErrorMessage('Please enter a valid Membership ID')
        return
      }
    }

    setErrorMessage('')
    let response

    if (
      journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ||
      journeyType === JOURNEY_TYPES.NEUCOINS_REINSTATE
    ) {
      setLoading(true)
      const recaptchaGenerated = await getRecaptchaToken()
      try {
        response = await axios.post(
          `${GENERATE_NEUPASS_OTP}`,
          JSON.stringify({
            phone: mobileNumber,
            countryCode: countryCode?.slice(1),
            recaptchaToken: recaptchaGenerated,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message)
      } finally {
        setLoading(false)
      }

      if (response?.status == 201 && response?.data?.userType == 'existing') {
        setApiData(response?.data)
        setOpenOTPModal(true)
      }
    } else if (
      journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION ||
      journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE
    ) {
      setLoading(true)
      try {
        response = await api.get(
          `/voucher/fetch-vouchers?limit=500&page=1&${
            inputMode === 'mobile'
              ? `mobile=${mobileNumber}`
              : `memberId=${memberShipNo}&category=${membership?.toUpperCase()}`
          }`,
          {},
        )
      } catch (error: any) {
        setErrorMessage(error?.response?.data?.message)
      } finally {
        setLoading(false)
      }
      if (response?.status == 200) {
        // setApiData(response?.data)
        updateGuestVouchers(response?.data)
        // setOpenOTPModal(true)
      }
    } else {
      setOpenOTPModal(true)
    }
  }

  const handleMemberIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event?.target?.value || ''
    const cleanedValue = value.replace(/[`~!$%^#&,.*()_|+\=?;:'"<>{}[\]\\\/]/gi, '')
    setMemberShipNo(isNaN(Number(value)) ? '' : cleanedValue)

    const isValid = membership.toLowerCase().includes('chambers')
      ? cleanedValue.length >= 4
      : cleanedValue.length === 12 || cleanedValue.length === 16

    if (!isValid) {
      setErrorMessage('Please enter a valid Membership ID')
    } else {
      setErrorMessage('')
    }
  }

  useEffect(() => {
    const check = true
    if (
      membership?.toLowerCase()?.includes('chambers')
        ? memberShipNo?.length > 0 && check
        : (memberShipNo?.length === 16 || memberShipNo?.length === 12) && check
    ) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [memberShipNo, membership])

  const handleOTPVerified = async () => {
    if (
      journeyType !== JOURNEY_TYPES.NEUCOINS_REDEMPTION &&
      journeyType !== JOURNEY_TYPES.NEUCOINS_REINSTATE
    ) {
      guestLogin({
        firstName: 'John',
        lastName: 'Doe',
        mobileNumber,
        countryCode,
      })
    }
  }

  return (
    <Box sx={{ p: 4, overflowY: 'auto', textAlign: 'center' }}>
      <Typography
        variant="h2"
        sx={{ fontFamily: 'var(--font-cinzel), serif', fontWeight: 700, mb: 4 }}
      >
        {convertString(journeyType)}
      </Typography>

      <Box margin="0 auto" maxWidth={{ xs: '100%', sm: '70%', md: '70%', lg: '60%', xl: '40%' }}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: theme.spacing(4),
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box sx={{ marginBottom: theme.spacing(3) }}>
              <Image
                src={
                  journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ||
                  journeyType === JOURNEY_TYPES.NEUCOINS_REINSTATE
                    ? '/logo/neupass_logo.jpg'
                    : '/logo/gravty_logo.png'
                }
                alt="Logo"
                width={280}
                height={100}
              />
            </Box>

            <Paper
              sx={{
                padding: theme.spacing(3),
                borderRadius: 2,
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, textAlign: 'center' }}>
                {inputMode === 'mobile' ? 'Enter Customer Mobile Number' : 'Enter Membership ID'}
              </Typography>

              {(journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION ||
                journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE) && (
                <FormControl fullWidth>
                  <InputLabel>Select Input Mode</InputLabel>
                  <Select
                    value={inputMode}
                    onChange={(e) => setInputMode(e.target.value as 'mobile' | 'membership')}
                    label="Select Input Mode"
                  >
                    <MenuItem value="mobile">Mobile Number</MenuItem>
                    <MenuItem value="membership">Membership ID</MenuItem>
                  </Select>
                </FormControl>
              )}

              {inputMode === 'membership' && (
                <FormControl fullWidth>
                  <InputLabel>Membership Type</InputLabel>
                  <Select
                    value={membership}
                    onChange={(e) =>
                      setMembership(e.target.value as 'epicure' | 'chambers' | 'hsbc')
                    }
                    label="Membership Type"
                  >
                    <MenuItem value="epicure">Epicure</MenuItem>
                    <MenuItem value="chambers">Chambers</MenuItem>
                    <MenuItem value="hsbc">HSBC</MenuItem>
                  </Select>
                </FormControl>
              )}

              {inputMode === 'mobile' ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {/* <FormControl variant="outlined" sx={{ flex: '0 0 35%', height: 56 }}>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={countryCode}
                      onChange={handleCountryChange}
                      label="Country"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: theme.typography.body2.fontSize,
                          padding: theme.spacing(1, 2),
                        },
                      }}
                    >
                      <MenuItem value="+1">+1 (USA)</MenuItem>
                      <MenuItem value="+91">+91 (India)</MenuItem>
                      <MenuItem value="+44">+44 (UK)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormInput
                    name={MobilePhoneNumber}
                    label="Enter Mobile Number"
                    value={mobileNumber}
                    onChange={handleMobileNumberChange}
                    error={!!errorMessage}
                    helperText={errorMessage}
                    type="string"
                    placeholder="ex : 91XXXXXX87"
                    customStyle={{ backgroundColor: '#f5f5f5' }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleGenerateOTP()
                      }
                    }}
                  /> */}
                  <PhoneInputWithCountrySelector
                    value={mobileNumber}
                    onChange={(fullPhone, countryCode) => {
                      setMobileNumber(fullPhone)
                      setCountryCode(countryCode)
                      setErrorMessage('')
                      setMobileError('')
                    }}
                    error={mobileError || errorMessage || ''}
                    setError={setMobileError}
                  />
                </Box>
              ) : (
                <FormInput
                  name="membershipId"
                  label="Membership ID"
                  value={memberShipNo}
                  onChange={handleMemberIdChange}
                  error={!!errorMessage}
                  helperText={errorMessage}
                  type="text"
                  placeholder="Enter Membership ID"
                />
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateOTP}
                disabled={
                  loading ||
                  (inputMode === 'mobile'
                    ? errorMessage?.length > 0 ||
                      mobileError?.length > 0 ||
                      mobileNumber?.length < 5
                    : !disable)
                }
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                sx={{
                  mt: 3,
                  p: theme.spacing(1.5, 3),
                  fontSize: theme.typography.h6.fontSize,
                  fontWeight: 600,
                  borderRadius: '50px',
                }}
              >
                {journeyType === JOURNEY_TYPES?.VOUCHERS_REDEMPTION ||
                journeyType === JOURNEY_TYPES?.VOUCHERS_REINSTATE
                  ? loading
                    ? 'Fetching Vouchers ...'
                    : 'Fetch Vouchers'
                  : loading
                  ? 'Genearting OTP ...'
                  : 'Generate OTP'}

                {/* <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              color="primary"
                              disabled={loading}
                              startIcon={loading && <CircularProgress size={20} color="inherit" />}
                              sx={{
                                paddingX: 5,
                                paddingY: 1.5,
                                borderRadius: 10,
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  backgroundColor: '#005fcc',
                                  transform: 'scale(1.05)',
                                },
                              }}
                            >
                              {loading ? 'Submitting...' : 'Submit'}
                            </Button>*/}
              </Button>
            </Paper>

            <OTPComponent
              open={openOTPModal}
              onClose={() => setOpenOTPModal(false)}
              mobileNumber={formatMobileNumber(mobileNumber, countryCode)}
              onVerified={handleOTPVerified}
              extraData={{ ...apiData, journey: `${journeyType}-login` }}
            />
          </Box>
        </Paper>

        {/* Tips & Info Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }} elevation={3}>
          {journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ? (
            <>
              <Typography variant="h6" gutterBottom>
                Neucoins Tips & Info
              </Typography>
              <Typography variant="body2" mb={1}>
                - Guests can redeem Neucoins to reduce their remaining payment.
              </Typography>
              <Typography variant="body2" mb={1}>
                - 1 Neucoin = ₹1 discount.
              </Typography>
              <Typography variant="body2">- Expired Neucoins cannot be redeemed.</Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Vouchers Tips & Info
              </Typography>
              <Typography variant="body2" mb={1}>
                - Guests can redeem Vouchers to reduce their remaining payment.
              </Typography>
              <Typography variant="body2">- Expired Vouchers cannot be redeemed.</Typography>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default ReceptionistDashboard
