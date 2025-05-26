// src/components/OTPComponent.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Box, TextField, Typography, Grid, Button, LinearProgress } from '@mui/material'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/authContext'
import CustomModal from './modal'
import { JOURNEY_TYPES, JOURNEYS } from './textFields/constants'
import { axios } from 'api/axios-instance'
import { VERIFY_NEUPASS_OTP } from '@/utils/apiConstants'
import { generateCodeChallenge, generateCodeVerifier } from '@/utils/apiUtils'
import { useGuestContext } from '@/context/guestContext'
import api from 'api/axios'
import { formatDateToYYYYMMDD } from '@/utils/date'
import CombinedModal from './modal/ReponseModal'
import KeyValueList from '@/utils/KeyValueList'

interface OTPComponentProps {
  open: boolean
  onClose: () => void
  email?: string
  mobileNumber?: string
  onVerified?: () => void
  extraData?: unknown
}

const OTPComponent: React.FC<OTPComponentProps> = ({
  open,
  onClose,
  email,
  mobileNumber,
  extraData,
  onVerified,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [otpError, setOtpError] = useState<string>('')
  const [attempts, setAttempts] = useState<number>(0)
  const [resendCount, setResendCount] = useState<number>(0)
  const [resendTimer, setResendTimer] = useState<number>(0)
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { login, isLoggedIn, verifyOtp, user } = useAuth()
  const { Guest, journeyType, guestLogin, guestLogout } = useGuestContext()
  const [openResultModal, setOpenResultModal] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'failure'>('failure')
  const [responseData, setResponseData] = useState<any>(null)
  useEffect(() => {
    if (open) {
      // resetOtpState()
      inputRefs.current[0]?.focus()
    }
  }, [open])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // useEffect(() => {
  //   if (open) {
  //     setOtp(['', '', '', '', '', ''])
  //     setOtpError('')
  //     setAttempts(0)
  //     setResendCount(0)
  //     setResendTimer(0)
  //     setIsLockedOut(false)
  //     inputRefs.current[0]?.focus()
  //   }
  // }, [open])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError('')
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    if (e.key === 'Backspace' && target.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP.')
      return
    }

    if (
      JOURNEYS.NEUCOINS_REDEMPTION_LOGIN === extraData?.journey ||
      JOURNEYS.NEUCOINS_REINSTATE_LOGIN === extraData?.journey
    ) {
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      const response = await axios.post(
        `${VERIFY_NEUPASS_OTP}`,
        JSON.stringify({
          phone: mobileNumber?.split(' ')[1],
          otp: otpString,
          refId: extraData?.refId,
          countryCode: mobileNumber?.split(' ')[0],
          codeVerifier,
          codeChallenge,
          isFromTCP: false,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (response?.status == 201) {
        guestLogin({ ...response?.data, accessToken: response?.headers?.['x-access-token'] })
        onVerified?.()
      } else {
        setOtpError(response?.message || 'Please enter a valid OTP.')
      }
    } else if (journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION) {
      let redeemNeucoinsData
      try {
        redeemNeucoinsData = await axios.post(
          'https://api-devv2.tajhotels.com/user360agg/v1/neucoins/action/redeem-points',
          {
            redeemDetails: {
              customerHash: Guest?.customerHash,
              otp: otpString,
            },
            roomBookingRequest: {
              bookingNumber: extraData?.bookingNumber,
              checkInDate: formatDateToYYYYMMDD(extraData?.checkIn),
              checkOutDate: formatDateToYYYYMMDD(extraData?.checkOut),
              invoiceAmount: extraData?.invoiceamount,
              invoiceNumber: extraData?.invoiceNumber,
              propertyId: '71758',
              propertyName: extraData?.propertyName,
              transactionBy: user?.firstName + user?.lastName,
              amount: extraData?.redeemNeucoins,
            },
            userDetails: {
              mobileNumber: user?.mobileNumber || '9966012856',
              emailId: user?.email,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Category: 'ROOM',
            },
          },
        )
      } catch (error) {
        console.error('Error redeeming neucoins:', error)
        setOtpError(error?.response?.data?.message || 'Error redeeming neucoins')
      } finally {
        setLoading(false)
      }
      if (
        redeemNeucoinsData?.status == 200 &&
        redeemNeucoinsData?.data?.transactionStatus === 'false'
      ) {
        setOtpError(redeemNeucoinsData?.data?.responseMessage || 'Please enter a valid OTP.')
        setModalType('failure')
        setOpenResultModal(true)
        setResponseData([
          {
            label: 'Transaction ID',
            value: redeemNeucoinsData?.data?.transactionId,
          },
          {
            label: 'Message',
            value: `${redeemNeucoinsData?.data?.responseMessage}.`,
          },
        ])
        // guestLogin({ ...redeemNeucoinsData?.data, accessToken: redeemNeucoinsData?.headers?.['x-access-token'] })
        onVerified?.()
      }
      // else {
      //   setOtpError(redeemNeucoinsData?.message || 'Please enter a valid OTP.')
      // }
    } else if (journeyType === JOURNEY_TYPES.LOGIN) {
      let responseData
      try {
        setLoading(true)
        setOtpError('')
        responseData = await verifyOtp(email, otp.join(''))
        if (responseData?.success) {
          router.push('/')
          onVerified?.()
          onClose()
        } else {
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          setOtpError('Please enter a valid OTP.')
          if (newAttempts >= 3) {
            setOtpError('Maximum number of attempts reached.')
            setIsLockedOut(true) // Lock out after max attempts
          }
          return
        }
      } catch (err: unknown) {
        if (err instanceof Error && 'response' in err && err.response?.data?.message) {
          setOtpError(err?.response?.data?.message)
        } else {
          setOtpError('OTP Verification failed')
        }
      } finally {
        setLoading(false)
      }
    }

    if (otpString == '214263') {
    }

    // if (!isLoggedIn) {
    //   const role: 'admin' | 'editor' | 'viewer' = 'admin'
    //   login(role)
    //   router.push('/')
    // } else {
    //   onVerified?.()
    // }
  }

  const handleResendOtp = () => {
    if (resendCount < 3 && !isLockedOut) {
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      setResendCount((prev) => prev + 1)
      setResendTimer(30)
      inputRefs.current[0]?.focus()
    }
  }

  return (
    <>
      <CustomModal open={open} onClose={onClose}>
        <Box>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Enter OTP Sent to Your <b>{email ? 'Email' : 'Mobile'}</b>
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            OTP has been sent to{' '}
            <Typography component={'span'} variant="body1" color="textPrimary" fontWeight={'bold'}>
              {email || mobileNumber}
            </Typography>
            . <br />
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }} align="center">
            {' '}
            Please enter the 6-digit OTP.
          </Typography>

          {isLockedOut ? (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
              You have reached the maximum number of attempts. Please try again later.
            </Typography>
          ) : (
            <Grid container spacing={1} justifyContent="center">
              {otp.map((digit, index) => (
                <Grid key={index}>
                  <TextField
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '20px' },
                    }}
                    sx={{ width: '45px' }}
                    variant="outlined"
                    disabled={isLockedOut}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {otpError && !isLockedOut && (
            <Typography color="error" sx={{ mt: 1 }} align="center">
              {otpError}
            </Typography>
          )}

          {!isLockedOut && (
            <Button
              onClick={handleVerifyOtp}
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={otp.join('').length < 6 || attempts >= 3}
            >
              Verify OTP
            </Button>
          )}

          {!isLockedOut && (
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={handleResendOtp}
                variant="text"
                fullWidth
                disabled={resendTimer > 0 || resendCount >= 3 || isLockedOut}
              >
                Resend OTP ({3 - resendCount} left)
              </Button>

              {resendTimer > 0 && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={((30 - resendTimer) / 30) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    color="textSecondary"
                  >
                    You can resend in {resendTimer}s
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </CustomModal>

      {openResultModal && (
        <CombinedModal
          onClose={() => {
            guestLogout()
            setOpenResultModal(false)
          }}
          open={openResultModal}
          type={modalType ? 'success' : 'failure'}
        >
          {JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ? (
            <KeyValueList data={responseData} />
          ) : (
            <></>
          )}
        </CombinedModal>
      )}
    </>
  )
}

export default OTPComponent
