// components/GuestForm.tsx
import React, { useState } from 'react'
import { Box, Button, Typography, CircularProgress } from '@mui/material'
import FormInput from '../textFields/FormInput'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import DateInput from '../DateInput'
import { useGuestContext } from '@/context/guestContext'
import OTPComponent from '../OTPComponent'
import { formatMobileNumber } from '@/utils/validateMobile'
import CombinedModal from '../modal/ReponseModal'
// import Grid from "@mui/material/Grid";

const fields = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number',
    required: true,
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  },
  {
    name: 'invoiceamount',
    label: 'Invoice Amount',
    required: true,
    type: 'number',
    disable: false,
    placeHolderText: 'ex : 2100.00',
  },
  {
    name: 'outletName',
    label: 'Outlet Name',
    required: true,
    disable: false,
    placeHolderText: 'ex : Vista',
  },

  {
    name: 'redeemNeucoins',
    label: 'Enter Neucoins to Redeem',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
]

const initialFormValues = fields.reduce((acc, field) => {
  acc[field.name] = field.type === 'date' ? null : field.name == 'propertyName' ? 'landsEnd' : ''
  return acc
}, {} as { [key: string]: string | Dayjs | null })

const TabItemPos = () => {
  const { Guest, guestLogout } = useGuestContext()
  const [formValues, setFormValues] = useState(initialFormValues)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'failure'>('success')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
    // Clear the error when user modifies the field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }
  //   const validate = () => {
  //     const newErrors: { [key: string]: string } = {};

  //     if (!formValues.firstName.trim())
  //       newErrors.firstName = "First Name is required";
  //     if (!formValues.lastName.trim())
  //       newErrors.lastName = "Last Name is required";
  //     if (!formValues.email.trim()) {
  //       newErrors.email = "Email is required";
  //     } else if (
  //       !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
  //     ) {
  //       newErrors.email = "Invalid email address";
  //     }
  //     if (!formValues.phone.trim()) {
  //       newErrors.phone = "Phone is required";
  //     } else if (!/^\d{10}$/.test(formValues.phone)) {
  //       newErrors.phone = "Phone must be 10 digits";
  //     }
  //     if (!formValues.dob.trim()) newErrors.dob = "DOB is required";
  //     if (!formValues.nationality.trim())
  //       newErrors.nationality = "Nationality is required";
  //     if (!formValues.passport.trim())
  //       newErrors.passport = "Passport Number is required";
  //     if (!formValues.roomNumber.trim())
  //       newErrors.roomNumber = "Room Number is required";
  //     if (!formValues.checkIn.trim())
  //       newErrors.checkIn = "Check-In Date is required";
  //     if (!formValues.checkOut.trim())
  //       newErrors.checkOut = "Check-Out Date is required";

  //     setErrors(newErrors);

  //     return Object.keys(newErrors).length === 0; // return true if no errors
  //   };

  const handleDateChange = (name: string, value: Dayjs | null) => {
    setFormValues((prev) => {
      const updatedForm = { ...prev, [name]: value }

      // Auto set checkout +1 day after checkin
      if (name === 'checkIn' && value) {
        const nextDay = value.add(1, 'day')
        if (!prev.checkOut || (prev.checkOut as Dayjs).isBefore(nextDay)) {
          updatedForm.checkOut = nextDay
        }
      }
      return updatedForm
    })
    // Clear the error when user modifies the field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    fields.forEach((field) => {
      const value = formValues[field.name]
      if (field.required) {
        if (
          (field.type === 'date' && !dayjs(value).isValid()) ||
          (!field.type && typeof value === 'string' && !value.trim())
        ) {
          newErrors[field.name] = `${field.label} is required`
        }
        if (field.type && typeof value === 'string' && !value.trim()) {
          newErrors[field.name] = `${field.label} is required`
        }
        if (
          typeof formValues.email === 'string' &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formValues.email)
        ) {
          newErrors.email = 'Invalid email format'
        }
        if (typeof formValues.phone === 'string' && !/^\d{10}$/.test(formValues.phone)) {
          newErrors.phone = 'Phone must be 10 digits'
        }
      }
    })

    // Extra validation: Check-out after check-in
    if (
      formValues.checkIn &&
      formValues.checkOut &&
      dayjs(formValues.checkOut).isBefore(dayjs(formValues.checkIn))
    ) {
      newErrors.checkOut = 'Check-Out cannot be before Check-In'
    }

    // Neucoins validation
    const redeemNeucoins = Number(formValues.redeemNeucoins) || 0
    if (redeemNeucoins <= 0) {
      newErrors.redeemNeucoins = 'Neucoins to redeem must be greater than zero'
    } else if (redeemNeucoins > Number(Guest?.neucoins ?? 0)) {
      newErrors.redeemNeucoins = `You can redeem a maximum of ${Guest?.neucoins} Neucoins`
    } else if (redeemNeucoins > (Number(formValues.invoiceamount) ?? 0)) {
      newErrors.redeemNeucoins = `You can redeem a maximum of ${formValues.invoiceamount} Neucoins`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        console.log('Form Submitted Successfully: ', formValues)
        // setFormValues(initialFormValues);
        setErrors({})
        setOpenOTPModal(!openOTPModal)
      }, 1500)
    }
  }

  const handleOTPVerified = () => {
    setOpen(true)
    setModalType('success')
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          padding: 4,
          backgroundColor: '#f7f9fc',
          borderRadius: 3,
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          marginTop: 4,
        }}
      >
        <Typography
          variant="h5"
          mb={3}
          fontWeight="bold"
          sx={{ color: '#333', textAlign: 'center' }}
        >
          Please Enter Booking Details
        </Typography>

        {/* <Grid container spacing={3}> */}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {fields.map((field) => {
            if (field.type === 'date') {
              return (
                <DateInput
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  value={formValues[field.name] as string}
                  onChange={(name, date) => handleDateChange(name, date ? dayjs(date) : null)}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  customStyle={{
                    flex: '1 1 30%',
                  }}
                />
              )
            }

            return (
              <FormInput
                name={field.name}
                label={field.label}
                value={formValues[field.name] as string}
                onChange={handleChange}
                error={!!errors[field.name]}
                helperText={errors[field.name]}
                type={field.type}
                key={field.name}
                disabled={field.disable}
                placeholder={field.placeHolderText}
                customStyle={{
                  flex: '1 1 30%',
                }}
              />
            )
          })}
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
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
          </Button>
        </Box>
      </Box>
      <OTPComponent
        open={openOTPModal}
        onClose={() => setOpenOTPModal(false)}
        mobileNumber={
          Guest
            ? formatMobileNumber(String(Guest.mobileNumber || ''), String(Guest.countryCode))
            : ''
        }
        onVerified={handleOTPVerified} // Update context on OTP verification
      />
      {open && (
        <CombinedModal
          onClose={() => {
            guestLogout()
            setOpen(false)
          }}
          open={open}
          type={modalType ? 'success' : 'failure'}
        />
      )}
    </LocalizationProvider>
  )
}

export default TabItemPos
