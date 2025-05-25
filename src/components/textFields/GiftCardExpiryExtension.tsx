import React, { useState } from 'react'

import {
  Box,
  Typography,
  TextField,
  Button,
  //   Select,
  //   MenuItem,
  //   FormControl,
  //   InputLabel,
  Paper,
  useTheme,
  //   SelectChangeEvent,
} from '@mui/material'
import { useGuestContext } from '@/context/guestContext' // Import useUserContext
import Image from 'next/image'
import CombinedModal from '@/components/modal/ReponseModal'
// import OTPComponent from "@/components/OTPComponent";
// import {
//   formatMobileNumber,
//   validateMobileNumber,
// } from "@/utils/validateMobile";
import { GCNumber, GCPin, Reason } from './constants'
import TextfieldValidator from '@/utils/validateMobile'
import GiftCardInfo from '../Redemption/GiftCardInfo'
import { convertString } from '@/utils/pathtoHeadingConverter'
import KeyValueList from '@/utils/KeyValueList'

interface CardData {
  cardNumber: string
  balance: string
  cardType: string
  expiryDate: string
  status: 'Active' | 'Inactive' | 'Blocked'
}

const GiftCardExpiryExtension: React.FC = () => {
  const { guestLogin, journeyType } = useGuestContext() // Get login method from context
  const theme = useTheme() // Access the theme
  const [gcData, setGCData] = useState<CardData | null>()
  const [balance, setBalance] = useState<string | null>(null)
  const [expiryDate, setExpiryDate] = useState('')
  const [wrongMsg, setWrongMsg] = useState<string>()
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({
    [GCNumber]: '',
    [GCPin]: '',
    [Reason]: '',
  })
  const [ErrorMessage, setErrorMessage] = useState<{ [key: string]: string }>({
    [GCNumber]: '',
    [GCPin]: '',
    [Reason]: '',
  })
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({
    [GCNumber]: false,
    [GCPin]: false,
    [Reason]: false,
  })
  const [openModal, setOpenModal] = useState<boolean>(false)

  const formValidation = (isFormValid: boolean, id: string) => {
    setFormErrors({ ...formErrors, [id]: !isFormValid })
  }

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWrongMsg('')
    setBalance('')
    setGCData(null)
    const { name, value } = event.target
    const { status, errorMsg, fieldName } = TextfieldValidator(name, value)
    setErrorMessage((prev: { [key: string]: string }) => {
      return {
        ...prev,
        [fieldName]: errorMsg,
      }
    })
    setFormValues((prev: { [key: string]: string }) => {
      return {
        ...prev,
        [name]: event?.target?.value,
      }
    })
    formValidation(status, name)
  }

  const fetchGCBalance = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    setWrongMsg('')
    setBalance('')
    if (
      !(formValues?.[GCNumber]?.replace(/\s/g, '').trim()?.length === 16) ||
      !(formValues?.[Reason]?.trim()?.length > 0) ||
      !(formValues?.[GCPin]?.trim()?.length === 6)
    ) {
      return
    }
    if (!formValues?.[GCNumber] || !formValues?.[Reason] || !formValues?.[GCPin]) {
      return
    }
    // const payLoad = {
    //   CardNumber: formValues?.GCNumber?.replace(/\s/g, "").trim(), //sample card number: "9530355500001794",
    //   CardPin: formValues?.GCPin, // card pin: "127367",
    // };
    const gcData: CardData = {
      cardNumber: '1234 5678 9012 3456',
      balance: '2,500.00',
      cardType: 'Gift Card',
      expiryDate: '12/26',
      status: 'Active',
    }
    setGCData(gcData)
    try {
      // manageGC
      //   .balanceEnquiry({
      //     balanceEnquiry: [payLoad],
      //   })
      //   .then((res) => {
      //     if (!res?.error) {
      //       setBalance(res?.data?.Cards?.[0]?.Balance);
      //       setExpiryDate(res?.data?.Cards?.[0]?.ExpiryDate);
      //     } else
      //       setWrongMsg(
      //         res?.data?.Cards?.[0]?.ResponseMessage || res?.data?.message
      //       );
      //   })
      //   .catch((err: Error) => {
      //     console.error(err);
      //   });
    } catch (error) {
      console.error(error)
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
  const gcExpiryExtension = [
    {
      label: 'status',
      value: 'CCAVE987654321',
    },
    {
      label: 'New Expiry Date',
      value: '2025-05-06',
    },
  ]
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
    setBalance(null)
    setGCData(null)
    setFormErrors({
      [GCNumber]: false,
      [GCPin]: false,
      [Reason]: false,
    })
    setExpiryDate('')
    setWrongMsg('')
    setFormValues({
      [GCNumber]: '',
      [GCPin]: '',
      [Reason]: '',
    })
  }

  const handleRedeem = () => {
    guestLogin({
      cardNumber: gcData?.cardNumber || '',
      balance: gcData?.balance || '',
      cardType: gcData?.cardType || '',
      expiryDate: gcData?.expiryDate || '',
      status: gcData?.status || '',
    }) // Update the context with user details
    setOpenModal(true)
  }

  return (
    <Box sx={{ p: 4, overflowY: 'auto', textAlign: 'center' }}>
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

        <Paper
          sx={{
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
                fontSize: theme.typography.body2.fontSize,
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
            type="password"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                // fontSize: "14px",
                // padding: "10px 14px",
                fontSize: theme.typography.body2.fontSize,
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
          />

          <TextField
            label="Reason"
            variant="outlined"
            fullWidth
            name={Reason}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: theme.typography.body2.fontSize,
                padding: theme.spacing(1, 2),
                height: 56,
              },
            }}
            error={formErrors[Reason]}
            helperText={formErrors[Reason] && formValues[Reason].length > 0 && ErrorMessage[Reason]}
            value={formValues?.[Reason]}
            placeholder="ex:Card Expired due to unforeseen circumstances"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeForm(e)}
          />

          <Box sx={{ display: 'flex', gap: 2, alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              disabled={
                !(
                  formValues?.GCNumber?.length === 19 &&
                  formValues?.GCPin?.length === 6 &&
                  formValues?.Reason?.length > 0
                )
              }
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
              disabled={
                !(
                  formValues?.GCNumber?.length === 19 &&
                  formValues?.GCPin?.length === 6 &&
                  formValues?.Reason?.length > 0
                )
              }
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
              Validate
            </Button>
          </Box>
        </Paper>

        {gcData && (
          <Box mt={4}>
            <Typography variant="h5" sx={{ mb: 3, color: '#2e3b55', fontWeight: 600 }}>
              GiftCard details
            </Typography>
            <GiftCardInfo
              cardNumber={gcData?.cardNumber || ''}
              balance={gcData?.balance || ''}
              cardType={gcData?.cardType || ''}
              expiryDate={gcData?.expiryDate || ''}
              status={gcData?.status || ''}
              isExpiryExtension={true}
              onRedeem={handleRedeem}
            />
          </Box>
        )}

        {/* <OTPComponent
        open={openOTPModal}
        onClose={() => setOpenOTPModal(false)}
        mobileNumber={formatMobileNumber(mobileNumber, countryCode)}
        onVerified={handleOTPVerified} // Update context on OTP verification
      /> */}
        <CombinedModal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            handleReset()
          }}
          type="success"
          title="Expiry Date Extended Successfully"
        >
          <Box textAlign="left">
            <KeyValueList data={gcExpiryExtension} />
          </Box>
        </CombinedModal>
      </Box>
    </Box>
  )
}

export default GiftCardExpiryExtension
