// components/GuestForm.tsx
import React, { useState } from 'react'
import { Box, Button, Typography, CircularProgress, SelectChangeEvent } from '@mui/material'
import FormInput from '../textFields/FormInput'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import DateInput from '../DateInput'
import { useGuestContext } from '@/context/guestContext'
import OTPComponent from '../OTPComponent'
import TextfieldValidator, { formatMobileNumber } from '@/utils/validateMobile'
import CombinedModal from '../modal/ReponseModal'
import { JOURNEY_TYPES } from '../textFields/constants'
import FormSelect from '../textFields/FormSelect'
import KeyValueList from '@/utils/KeyValueList'
import api from 'api/axios'
import {
  ccAvenueGeneratePayments,
  commonFields,
  fields,
  gcReinstateInstateFields,
  gcVoucherRedemption,
  neuCoinsReInstateFields,
  voucherReinstateFields,
} from './constants'
import { formatDateToYYYYMMDD } from '@/utils/date'
import { useAuth } from '@/context/authContext'
// import { QRCodeSVG } from 'qrcode.react'
// import Link from 'next/link'
// import Grid from "@mui/material/Grid";

const TabItemRoom = () => {
  const { Guest, guestLogout, journeyType } = useGuestContext()
  const { user } = useAuth()
  const journeyFields =
    journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ||
    journeyType === JOURNEY_TYPES.TEGC_REDEMPTION
      ? fields
      : journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION
      ? commonFields
      : journeyType === JOURNEY_TYPES.NEUCOINS_REINSTATE
      ? neuCoinsReInstateFields
      : journeyType === JOURNEY_TYPES.TEGC_REINSTATE
      ? gcReinstateInstateFields
      : journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE
      ? voucherReinstateFields
      : journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION
      ? gcVoucherRedemption
      : ccAvenueGeneratePayments
  const initialFormValues = journeyFields.reduce((acc, field) => {
    acc[field.name] =
      field.type === 'date'
        ? null
        : field.name == 'propertyName'
        ? 'Taj lands End Mumbai'
        : field.name == 'memberID'
        ? Guest?.memberID?.toString() || ''
        : field.name == 'bitDate'
        ? Guest?.createdOn?.toString() || ''
        : field.name == 'memberType'
        ? Guest?.label?.toString() || ''
        : field.name == 'bitId'
        ? Guest?.bitID?.toString() || ''
        : field.name == 'redeemNeucoins'
        ? '1'
        : ''
    return acc
  }, {} as { [key: string]: string | Dayjs | null })
  const userAmount =
    JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType
      ? Guest?.loyaltyInfo?.[0]?.loyaltyPoints
      : JOURNEY_TYPES.TEGC_REDEMPTION === journeyType
      ? Guest?.balance
      : 1
  const [formValues, setFormValues] = useState(initialFormValues)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'failure'>('success')
  const [apiResponseData, setApiResponseData] = useState<any>(null)
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
  const neuCoinsJourneyMobileNumber =
    Guest?.primaryMobile &&
    typeof Guest.primaryMobile === 'object' &&
    'phoneNumber' in Guest.primaryMobile
      ? Guest?.primaryMobile.phoneNumber
      : ''
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
    journeyFields.forEach((field) => {
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
        if (formValues.GCNumber) {
          // const { name, value } = event.target
          const { status, errorMsg } = TextfieldValidator(field.name, value as string)

          if (status) {
            newErrors.GCNumber = errorMsg
          }
          // setErrorMessage((prev: { [key: string]: string }) => {
          //   return {
          //     ...prev,
          //     [fieldName]: errorMsg,
          //   }
          // })
          // setFormValues((prev: { [key: string]: string }) => {
          //   return {
          //     ...prev,
          //     [name]: event?.target?.value,
          //   }
          // })
          // formValidation(status, name)
          // let CardNumber: string = value as string
          // if (parseInt(CardNumber, 10) > 19) {
          //   CardNumber = CardNumber.substr(0, 19)
          // }
          // const inputVal = CardNumber?.replace(/ /g, '')
          // let inputNumbersOnly = inputVal?.replace(/\D/g, '')
          // if (inputNumbersOnly?.length >= 16) {
          //   inputNumbersOnly = inputNumbersOnly
          //     .replace(/[`~!$%^@*()_|+\\=?;:'"<>{}/\\[\]\\]/gi, '')
          //     .substr(0, 16)
          // }
          // const splits = inputNumbersOnly?.match(/.{1,4}/g)
          // let spacedNumber = ''
          // if (splits) {
          //   spacedNumber = splits?.join(' ')
          // }
          // if (spacedNumber.slice(0, 1) !== '0') {
          //   setFormValues((prev: { [key: string]: string }) => {
          //     return {
          //       ...prev,
          //       GCNumber: spacedNumber.trim(),
          //     }
          //   })
          // }
          // const { name, value } = event.target
          // const { status, errorMsg, fieldName } = TextfieldValidator(name, value)
          // setErrorMessage((prev: { [key: string]: string }) => {
          //   return {
          //     ...prev,
          //     [fieldName]: errorMsg,
          //   }
          // })
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
    if (
      formValues.redeemNeucoins &&
      JOURNEY_TYPES.VOUCHERS_REDEMPTION !== journeyType &&
      JOURNEY_TYPES.CC_AVENUE_PAYMENTS !== journeyType &&
      JOURNEY_TYPES.VOUCHERS_REINSTATE !== journeyType
    ) {
      const redeemNeucoins = Number(formValues.redeemNeucoins) || 0
      if (redeemNeucoins <= 0) {
        newErrors.redeemNeucoins = 'Neucoins to redeem must be greater than zero'
      } else if (redeemNeucoins > Number(userAmount ?? 0)) {
        newErrors.redeemNeucoins = `You can redeem a maximum of ${userAmount} ${
          JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ? 'Neucoins' : 'GiftCard Amount'
        }`
      } else if (redeemNeucoins > (Number(formValues.invoiceamount) ?? 0)) {
        newErrors.redeemNeucoins = `You can redeem a maximum of ${formValues.invoiceamount} ${
          JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ? 'Neucoins' : 'GiftCard Amount'
        }`
      } else if (redeemNeucoins == 0) {
        newErrors.redeemNeucoins = `Please enter more than  ${userAmount} ${
          JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ? 'Neucoins' : 'Amount'
        }`
      }
    } else if (formValues.redeemNeucoins && JOURNEY_TYPES.CC_AVENUE_PAYMENTS !== journeyType) {
      const redeemNeucoins = Number(formValues.redeemNeucoins) || 0
      if (redeemNeucoins == 0) {
        newErrors.redeemNeucoins = `Please enter more than  ${userAmount} ${
          JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ? 'Neucoins' : 'Amount'
        }`
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      if (journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION) {
        setLoading(true)
        let validateNeucoinsData
        try {
          validateNeucoinsData = await api.post('nc/validate', {
            customerHash: Guest?.customerHash,
            points: formValues.redeemNeucoins,
            storeId: 'HLTBOMLE',
          })
        } catch (error) {
          setErrors({ redeemNeucoins: (error as any)?.response?.data?.message })
          return
        } finally {
          setLoading(false)
        }
        if (validateNeucoinsData?.status !== 200) {
          setErrors({ redeemNeucoins: validateNeucoinsData?.data?.message })
        } else if (validateNeucoinsData?.status === 200) {
          setOpenOTPModal(!openOTPModal)
        }
      } else if (journeyType === JOURNEY_TYPES.TEGC_REDEMPTION) {
        setLoading(true)
        let gcRedemeptionData
        try {
          gcRedemeptionData = await api.post(
            'gc/redeem',
            {
              inputType: '1',
              cards: [
                {
                  CardNumber: Guest?.cardNumber,
                  CardPin: Guest?.cardPin,
                  Amount: formValues.redeemNeucoins,
                },
              ],
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: formValues?.redeemNeucoins,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({
            redeemNeucoins:
              (error as any)?.response?.data?.message ||
              'Oops! Something went wrong while redeeming your gift card. Please check your details and try again.',
            // ||
            // (error as any)?.response?.data?.error?.errorDescription,
          })
          return
        } finally {
          setLoading(false)
        }
        if (gcRedemeptionData?.status !== 200) {
          setErrors({ redeemNeucoins: gcRedemeptionData?.data?.message })
        } else if (gcRedemeptionData?.status === 200) {
          setOpen(true)
          setModalType('success')
          setApiResponseData([
            {
              label: 'TransactionId',
              value: gcRedemeptionData?.data?.transactionId,
            },
            {
              label: 'Approval Code',
              value: gcRedemeptionData?.data?.approvalCode,
            },
            {
              label: 'Current Batch Number',
              value: gcRedemeptionData?.data?.currentBatchNumber,
            },
            {
              label: 'Card Balance',
              value: gcRedemeptionData?.data?.cards?.[0]?.balance,
            },
            {
              label: 'Amount Debited',
              value: formValues.redeemNeucoins,
            },
          ])
        }
      } else if (journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION) {
        setLoading(true)
        let voucherRedemptionData
        try {
          voucherRedemptionData = await api.post(
            'voucher/redeem',
            {
              h_bit_date: new Date().toISOString(),
              h_member_id: Guest?.memberID,
              h_privileges: Guest?.uniquePrivilegeCode,
              pin: Guest?.pin,
              type: Guest?.label === 'THE CHAMBERS' ? 'CHAMBERS' : Guest?.label,
              hotelSponsorId: Guest?.sponsor_id,
              h_location: '',
              h_bit_source: 'PMS',
              h_bit_source_generated_id: 'NA',
              h_start_date: formatDateToYYYYMMDD(Guest?.createdOn),
              h_end_date: formatDateToYYYYMMDD(Guest?.validTill),
              folio_number: null,
              rate_code:
                Guest?.extraData &&
                typeof Guest.extraData === 'object' &&
                'promocode' in Guest.extraData
                  ? Guest?.extraData?.promocode
                  : '',
              h_comment: '',
              h_bit_amount: null,
              h_Representative_Email: null,
              h_confirmation_number: formValues?.bookingNumber,
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: 0,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({ redeemNeucoins: (error as any)?.response?.data?.message })
          return
        } finally {
          setLoading(false)
        }
        if (
          voucherRedemptionData?.status !== 200 ||
          (voucherRedemptionData?.status === 200 && voucherRedemptionData?.data?.error?.code)
        ) {
          setErrors({
            redeemNeucoins:
              voucherRedemptionData?.data?.message || voucherRedemptionData?.data?.error?.message,
          })
        } else if (voucherRedemptionData?.status === 200) {
          setOpen(true)
          setModalType('success')
          setApiResponseData([
            {
              label: 'Availment Bit ID',
              value: voucherRedemptionData?.data?.data?.availed_privileges?.[0]?.availment_bit_id,
            },
          ])
        }
      } else if (journeyType === JOURNEY_TYPES.TEGC_REINSTATE) {
        setLoading(true)
        let tegcReinstateData
        try {
          tegcReinstateData = await api.post(
            'gc/cancel-redeem',
            {
              Cards: [
                {
                  CardNumber: formValues?.GCNumber,
                  OriginalRequest: {
                    OriginalAmount: formValues?.originalAmount,
                    OriginalApprovalCode: formValues?.originalApprovalCode,
                    OriginalBatchNumber: formValues?.originalBatchNumber,
                    OriginalTransactionId: formValues?.originalTransactionId,
                  },
                },
              ],
              InputType: 1,
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: formValues?.reinstateGiftCard,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({ redeemNeucoins: (error as any)?.response?.data?.message })
          return
        } finally {
          setLoading(false)
        }
        setOpen(true)
        if (
          tegcReinstateData?.status !== 200 ||
          (tegcReinstateData?.status === 200 &&
            tegcReinstateData?.data?.responseMessage === 'Validation Failed.')
        ) {
          setModalType('failure')
          setErrors({ redeemNeucoins: tegcReinstateData?.data?.message })
          setApiResponseData([
            {
              label: 'Error Reason',
              value:
                tegcReinstateData?.data?.cards?.[0]?.responseMessage ||
                'An error occurred while reinstating the card.',
            },
          ])
        } else if (tegcReinstateData?.status === 200) {
          setModalType('success')
          setApiResponseData([
            {
              label: 'TransactionId',
              value: tegcReinstateData?.data?.transactionId,
            },
            {
              label: 'Approval Code',
              value: tegcReinstateData?.data?.approvalCode,
            },
            {
              label: 'Current Batch Number',
              value: tegcReinstateData?.data?.currentBatchNumber,
            },
            {
              label: 'Card Balance',
              value: tegcReinstateData?.data?.cards?.[0]?.balance,
            },
          ])
        }
      } else if (journeyType === JOURNEY_TYPES.NEUCOINS_REINSTATE) {
        setLoading(true)
        let neucoinsReinstateData
        try {
          neucoinsReinstateData = await api.post(
            'nc/reverse',
            {
              reversalDetails: {
                redemptionId: formValues?.redemptionId,
                customerHash: Guest?.customerHash,
                storeId: 'HLTBOMLE',
              },
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: formValues?.reinstateNeucoins,
              },
              userDetails: {
                mobileNumber: neuCoinsJourneyMobileNumber,
                emailId: user?.email,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({ reinstateNeucoins: (error as any)?.response?.data?.error?.data })
          return
        } finally {
          setLoading(false)
        }
        setOpen(true)
        if (
          (neucoinsReinstateData?.status == 200 &&
            neucoinsReinstateData?.data?.transactionStatus === 'false') ||
          neucoinsReinstateData?.status !== 200
        ) {
          setModalType('failure')
          setOpen(true)
          setApiResponseData([
            {
              label: 'Transaction ID',
              value: neucoinsReinstateData?.data?.transactionId,
            },
            {
              label: 'Message',
              value: `${neucoinsReinstateData?.data?.responseMessage}.`,
            },
          ])
        } else if (
          neucoinsReinstateData?.status == 200 &&
          neucoinsReinstateData?.data?.transactionStatus === 'true'
        ) {
          setModalType('success')
          setOpen(true)
          setApiResponseData([
            {
              label: 'Transaction ID',
              value: neucoinsReinstateData?.data?.transactionId,
            },
            {
              label: 'Message',
              value: `Reversal of ${
                neucoinsReinstateData?.data?.pointsReversed
              } NeuCoins successful for Customer ID: ${formatMobileNumber(
                String(formValues.phone || ''),
                '+91',
              )}.`,
            },
          ])
        }
      } else if (journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE) {
        setLoading(true)
        let voucherReinstateData
        try {
          voucherReinstateData = await api.post(
            'voucher/reversal',
            {
              h_bit_date: Guest?.createdOn,
              cancel_bit_id: Guest?.bitID,
              h_member_id: Guest?.memberID,
              hotelSponsorId: Guest?.sponsor_id,
              type: Guest?.label === 'THE CHAMBERS' ? 'CHAMBERS' : Guest?.label,
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: 0,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({ redeemNeucoins: (error as any)?.response?.data?.message })
          return
        } finally {
          setLoading(false)
        }
        if (voucherReinstateData?.status !== 200) {
          setErrors({ redeemNeucoins: voucherReinstateData?.data?.error })
        } else if (
          voucherReinstateData?.status === 200 &&
          voucherReinstateData?.data?.status === 'SUCCESS'
        ) {
          setOpen(true)
          setModalType('success')
          setApiResponseData([
            {
              label: 'Cancel Bit ID',
              value: voucherReinstateData?.data?.original_bit?.header?.cancel_bit_id,
            },
            {
              label: 'Program ID',
              value: voucherReinstateData?.data?.original_bit?.header?.h_program_id,
            },
          ])
        }
      } else if (journeyType === JOURNEY_TYPES.CC_AVENUE_PAYMENTS) {
        setLoading(true)
        let ccAvenuePaymentResponseData
        try {
          ccAvenuePaymentResponseData = await api.post(
            'ca/generate-invoice',
            {
              roomBookingRequest: {
                bookingNumber: formValues?.bookingNumber,
                checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
                checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
                invoiceAmount: formValues?.invoiceamount,
                invoiceNumber: formValues?.invoiceNumber,
                propertyId: '71758',
                propertyName: formValues?.propertyName,
                transactionBy:
                  user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
                amount: formValues?.redeemNeucoins,
              },
              userDetails: {
                mobileNumber: formValues?.phone || '',
                emailId: formValues?.email,
                name: formValues?.guestName,
                countryCode: '+91',
              },
              invoiceDetails: {
                billDeliveryType: 'SMS',
                currency: 'INR',
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                category: 'ROOM',
              },
            },
          )
        } catch (error) {
          setErrors({ redeemNeucoins: (error as any)?.response?.data?.message })
          return
        } finally {
          setLoading(false)
        }
        if (ccAvenuePaymentResponseData?.status !== 200) {
          setErrors({ redeemNeucoins: ccAvenuePaymentResponseData?.data?.message })
        } else if (ccAvenuePaymentResponseData?.status === 200) {
          setOpen(true)
          setModalType('success')
          setApiResponseData([
            {
              label: 'Invoice Id',
              value: ccAvenuePaymentResponseData?.data?.invoice_id,
            },
            {
              label: 'Merchant Reference Number',
              value: ccAvenuePaymentResponseData?.data?.merchant_reference_no,
            },
            // {
            //   label: 'Payment URL',
            //   value: ccAvenuePaymentResponseData?.data?.tiny_url,
            // },
            // {
            //   label: 'QR Code',
            //   identifier: 'qrCode',
            //   value: ccAvenuePaymentResponseData?.data?.qr_code,
            // },
          ])
        }
      } else {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)

          // setFormValues(initialFormValues);
          // setErrors({})
          if (
            journeyType === JOURNEY_TYPES.CC_AVENUE_PAYMENTS ||
            journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION ||
            journeyType === JOURNEY_TYPES.TEGC_REDEMPTION
          ) {
            //   handleOTPVerified()
          } else {
            //  setOpenOTPModal(!openOTPModal)
          }
        }, 1500)
      }
    }

    // if (response.status == 200) {
    // const { refreshToken, user_role, name } = response.data
    // const { access_token: accessToken } = response?.headers
    // setAccessToken(accessToken)
    // // setRefreshToken(refreshToken)
    // const user = {
    //   firstName: name,
    //   email: email || '',
    //   employeeId: '77878',
    //   lastName: name,
    //   propertyId: '898343',
    //   propertyName: 'Taj lands end',
    //   role: user_role,
    // }
    // setUser(user)
    // localStorage.setItem('accessToken', accessToken)
    // localStorage.setItem('refreshToken', refreshToken)
    // localStorage.setItem('user', JSON.stringify(user))
    // if (!user_role) return
    // Cookies.set('userType', user_role, { expires: 1 })
    // setUserType(user_role)
    // }

    // setFormValues(initialFormValues);
    // setErrors({})
    if (
      journeyType === JOURNEY_TYPES.CC_AVENUE_PAYMENTS ||
      journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION ||
      journeyType === JOURNEY_TYPES.TEGC_REDEMPTION
    ) {
      //  handleOTPVerified()
    } else {
      // setOpenOTPModal(!openOTPModal)
    }
    // }, 1500)
    // }
  }

  const handleOTPVerified = async (otp: string) => {
    if (journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION) {
      let redeemNeucoinsData
      try {
        redeemNeucoinsData = await api.post(
          'nc/redeem',
          {
            redeemDetails: {
              customerHash: Guest?.customerHash,
              otp: otp,
              storeId: 'HLTBOMLE',
            },
            roomBookingRequest: {
              bookingNumber: formValues?.bookingNumber,
              checkInDate: formatDateToYYYYMMDD(formValues?.checkIn),
              checkOutDate: formatDateToYYYYMMDD(formValues?.checkOut),
              invoiceAmount: formValues?.invoiceamount,
              invoiceNumber: formValues?.invoiceNumber,
              propertyId: '71758',
              propertyName: formValues?.propertyName,
              transactionBy:
                user?.email || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
              amount: formValues?.redeemNeucoins,
            },
            userDetails: {
              mobileNumber: neuCoinsJourneyMobileNumber,
              emailId: Guest?.primaryEmailId,
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
        setModalType('failure')
        console.error('Error redeeming neucoins:', error)
      } finally {
        setLoading(false)
        setOpenOTPModal(false)
      }
      if (
        (redeemNeucoinsData?.status == 200 &&
          redeemNeucoinsData?.data?.transactionStatus === 'false') ||
        redeemNeucoinsData?.status !== 200
      ) {
        setModalType('failure')
        setOpen(true)
        setApiResponseData([
          {
            label: 'Transaction ID',
            value: redeemNeucoinsData?.data?.transactionId,
          },
          {
            label: 'Message',
            value: `${redeemNeucoinsData?.data?.responseMessage}.`,
          },
        ])
      } else if (
        redeemNeucoinsData?.status == 200 &&
        redeemNeucoinsData?.data?.transactionStatus === 'true'
      ) {
        setModalType('success')
        setOpen(true)
        setApiResponseData([
          {
            label: 'Transaction ID',
            value: redeemNeucoinsData?.data?.transactionId,
          },
          {
            label: 'Redemption ID',
            value: redeemNeucoinsData?.data?.redemptionId,
          },
          {
            label: 'Booking Number',
            value: redeemNeucoinsData?.data?.bookingNumber,
          },
        ])
      }
    }
    // if (journeyType !== JOURNEY_TYPES.NEUCOINS_REDEMPTION) {
    //   setOpen(true)
    //   setModalType('success')
    // }
  }

  const vouchersExpiryExtensionResponseData = [
    {
      label: 'Privilege Code',
      value: 'VIP789',
    },
    {
      label: 'Request Status',
      value: 'STATUS',
    },
    {
      label: 'Previous Expiry Date',
      value: `${Guest?.expiryDate}`,
    },
    {
      label: 'New Expiry Date',
      value: Guest?.expiryDate ? `${dayjs(Guest.expiryDate).toDate().toISOString()}` : '',
    },
  ]
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
          {journeyFields.map((field) => {
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

            if (field.type === 'dropdown') {
              return (
                <FormSelect
                  name={field.name}
                  label={field.label}
                  value={formValues[field.name] as string}
                  onChange={(e: SelectChangeEvent) =>
                    setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                  }
                  options={'options' in field ? (field.options as string[]) : []}
                  key={field.name}
                  disabled={field.disable}
                  placeholder={field.placeHolderText}
                />
              )
            }

            if (field.type === 'string' || field.type === 'number') {
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
            }
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
            {journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ||
            journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE ||
            journeyType === JOURNEY_TYPES.TEGC_REDEMPTION ||
            journeyType === JOURNEY_TYPES.TEGC_REINSTATE ||
            JOURNEY_TYPES.NEUCOINS_REINSTATE === journeyType
              ? loading
                ? 'Submitting...'
                : 'Submit'
              : JOURNEY_TYPES.VOUCHERS_REDEMPTION === journeyType
              ? loading
                ? 'Redeeming Voucher...'
                : 'Redeem Voucher'
              : journeyType === JOURNEY_TYPES.CC_AVENUE_PAYMENTS
              ? loading
                ? 'Generating Link...'
                : 'Generate Link'
              : loading
              ? 'Verifying Mobile...'
              : 'Verify Mobile'}
          </Button>
        </Box>
      </Box>

      <OTPComponent
        open={openOTPModal}
        onClose={() => setOpenOTPModal(false)}
        mobileNumber={
          neuCoinsJourneyMobileNumber
            ? formatMobileNumber(
                String(neuCoinsJourneyMobileNumber),
                Guest?.primaryMobile &&
                  typeof Guest.primaryMobile === 'object' &&
                  'isdCode' in Guest.primaryMobile
                  ? String(Guest?.primaryMobile?.isdCode)
                  : '',
              )
            : formatMobileNumber(String(formValues.phone || ''), '+91')
        }
        extraData={formValues}
        onVerified={(otp: string) => handleOTPVerified(otp)} // Update context on OTP verification
      />
      {open && (
        <CombinedModal
          onClose={() => {
            guestLogout()
            setOpen(false)
            setErrors({})
            setFormValues(initialFormValues)
          }}
          open={open}
          type={modalType}
          title={
            JOURNEY_TYPES.CC_AVENUE_PAYMENTS === journeyType ? 'Link Generated Successfully' : ''
          }
        >
          {JOURNEY_TYPES.TEGC_REDEMPTION === journeyType ||
          JOURNEY_TYPES.VOUCHERS_REINSTATE === journeyType ||
          JOURNEY_TYPES.NEUCOINS_REDEMPTION === journeyType ||
          JOURNEY_TYPES.NEUCOINS_REINSTATE === journeyType ||
          JOURNEY_TYPES.TEGC_REINSTATE === journeyType ||
          JOURNEY_TYPES.VOUCHERS_REDEMPTION === journeyType ? (
            <KeyValueList data={apiResponseData} />
          ) : JOURNEY_TYPES.CC_AVENUE_PAYMENTS === journeyType ? (
            <>
              <KeyValueList data={apiResponseData} />
              {/* <QRCode value={qrCode} size={256} /> */}
              {/* <QRCodeSVG
                value={apiResponseData?.filter((data: any) => data?.identifier === 'qrCode')?.value}
              /> */}
              {/* <QRCodeSVG
                value={apiResponseData?.filter((data: any) => data?.identifier === 'qrCode')?.value}
              /> */}
              {/* <Typography>Payment Link</Typography> */}
              {/* <Link
                href={apiResponseData?.find((data: any) => data.label === 'Payment URL')?.value}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'primary.main', textDecoration: 'underline' }}
              /> */}

              <Typography>
                Want to see your payment status? Just click on the &apos;Order Status&apos; tab!
              </Typography>
            </>
          ) : JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION === journeyType ? (
            <>
              <KeyValueList data={vouchersExpiryExtensionResponseData} />
              <Typography>Voucher expiry date extended successfully.</Typography>
            </>
          ) : (
            <></>
          )}
        </CombinedModal>
      )}
    </LocalizationProvider>
  )
}

export default TabItemRoom
