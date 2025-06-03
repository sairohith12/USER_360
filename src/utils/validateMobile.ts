import {
  Email,
  GCNumber,
  GCPin,
  MobilePhoneNumber,
  Reason,
} from '@/components/textFields/constants'

// utils/validateMobile.ts
export const validateMobileNumber = (mobileNumber: string, countryCode: string): boolean => {
  if (countryCode === '+91') {
    const phoneRegex = /^[0]?[6789]\d{9}$/ //regex valid mobile number and for only numbers and Indian numbers starting from 6
    const isValid =
      phoneRegex.test(mobileNumber) && mobileNumber.length === 10 && mobileNumber.length <= 10
    return isValid
  } else {
    return false
  }
}

export const formatMobileNumber = (mobileNumber: string, countryCode: string): string => {
  return `${countryCode} ${mobileNumber}`
}

// a) No special characters except letters, digits, spaces
export function isValidStringField(value: string) {
  const regex = /^[a-zA-Z0-9 ]+$/
  return regex.test(value)
}

// b) Currency validation: number > 0, max 2 decimals
export function isValidCurrency(value: string | number) {
  const strVal = value.toString()
  const regex = /^\d+(\.\d{1,2})?$/
  if (!regex.test(strVal)) return false
  return Number(strVal) > 0
}

// c) invoiceNumber: letters, digits, underscore only
export function isValidInvoiceNumber(value: string) {
  const regex = /^[a-zA-Z0-9_]*$/
  return regex.test(value)
}

export const TextfieldValidator = (
  name: string,
  value: string,
  additionalInfo?: { countryCode?: string },
) => {
  let status: boolean | null | RegExpMatchArray = false

  let errorMsg: string | undefined = ''

  // the cases should be only boolean values

  switch (name) {
    case MobilePhoneNumber:
      if (additionalInfo?.countryCode === '+91') {
        const regex = /^[0]?[6789]\d{9}$/ //regex valid mobile number and for only numbers and Indian numbers starting from 6
        status = regex.test(value) && value.length === 10 && value.length <= 10
      } else {
        const regex = /^[0-9]+$/ //regex for only numbers
        status = regex.test(value)
      }
      errorMsg = 'Please enter a valid mobile number'
      break

    case GCNumber:
      const regexGCNumber = /^[0-9 ]+$/ //regex for only numbers and spaces
      status = regexGCNumber.test(value) && value.trim()?.length === 16
      errorMsg = 'Please enter valid 16 Digits Gift Card Number'
      break

    case GCPin:
      status = value.length === 6
      errorMsg = 'Please enter a valid 6 digits PIN'
      break
    case Reason:
      status = value.length > 0
      errorMsg = 'Please enter a valid Reason'
      break
    case Email:
      status =
        value.length > 3 &&
        value.match(
          /^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,4})+(\.[a-zA-Z]{2,6})*$/,
        ) //regex for email
      errorMsg = 'Please enter a valid email'
      break
    default:
      break
  }
  return { status: !!status, errorMsg, fieldName: name }
}

export default TextfieldValidator
