import { GCNumber, JOURNEY_TYPES } from '../textFields/constants'

// Base field configuration
const baseField: {
  required: boolean
  disable: boolean
  type: string
  placeHolderText: string
  options?: string[]
} = {
  required: true,
  disable: false,
  type: 'string',
  placeHolderText: 'string',
}

// Function to create a field with common properties
const createField = (name: string, label: string, options: Partial<typeof baseField> = {}) => ({
  name,
  label,
  ...baseField,
  ...options,
})

// Common fields
const commonFields = [
  createField('propertyName', 'Property Name*', {
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  }),
  createField('bookingNumber', 'Itinerary Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
  }),
  createField('invoiceamount', 'Invoice Amount*', {
    required: true,
    type: 'number',
    disable: false,
    placeHolderText: 'ex : 2100.00',
  }),
  createField('checkIn', 'Check-In Date*', { required: true, type: 'date', disable: false }),
  createField('checkOut', 'Check-Out Date*', { required: true, type: 'date', disable: false }),
  createField('invoiceNumber', 'Invoice Number*', {
    required: true,
    type: 'string',
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  }),
]

export const fields = [
  ...commonFields,
  createField('redeemNeucoins', 'Enter Amount to Redeem', {
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
]

export const neuCoinsReInstateFields = [
  ...commonFields,
  createField('redemptionId', 'Redemption ID*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : Izjiejjk',
  }),
  createField('reinstateNeucoins', 'Enter Neucoins Amount to Reverse*', {
    type: 'number',
    required: true,
    placeHolderText: 'ex : 1000',
  }),
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    type: 'dropdown',
    required: true,
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Order Cancellation', 'Change in Plans', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]

export const gcReinstateInstateFields = [
  ...commonFields,
  createField(GCNumber, 'GiftCard Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : XXXX XXXX XXXX XXXX',
  }),
  createField('phone', 'Mobile Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  }),
  createField('reinstateGiftCard', 'Amount to Reverse*', {
    required: true,
    disable: false,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
  createField('originalApprovalCode', 'Original ApprovalCode*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 115152243',
  }),
  createField('originalBatchNumber', 'Original BatchNumber*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 14413770',
  }),
  createField('originalTransactionId', 'Original TransactionId*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 98',
  }),
  createField('originalAmount', 'Original Amount*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 100',
  }),
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    required: true,
    disable: false,
    type: 'dropdown',
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Payment Failure', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]

export const voucherReinstateFields = [
  ...commonFields,
  createField('redeemNeucoins', 'Enter Amount to Reinstate*', {
    required: true,
    disable: false,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    type: 'dropdown',
    required: true,
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Payment Failure', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]

export const ccAvenueGeneratePayments = [
  ...commonFields,
  createField('guestName', 'Guest Name*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex: XXX XXX',
  }),
  createField('phone', 'Mobile Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  }),
  createField('email', 'Guest Email*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : sxxxxxxx@gmail.com',
  }),
  createField('redeemNeucoins', 'Enter Amount to be Paid*', {
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
]

export const gcVoucherRedemption = [
  ...commonFields,
  createField('newExpiryDate', 'New Expiry Date*', {
    required: true,
    disable: false,
    type: 'date',
  }),
  createField('memberID', 'Member ID*', {
    required: true,
    disable: true,
    placeHolderText: 'ex : 5173',
  }),
  createField('bitDate', 'Created On*', {
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'ex : XXX-XX-XXT00:00:00+05:30',
  }),
  createField('phone', 'Mobile Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  }),
  createField('email', 'Guest Email*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : sxxxxxxx@gmail.com',
  }),
  createField('reasonforExtension', 'Select Reason for Extension*', {
    type: 'dropdown',
    required: true,
    placeHolderText: 'ex : Extended stay due to travel disruption',
    options: ['Order Issue', 'Change in Plans'],
  }),
]
// Common fields
const posCommonFields = [
  createField('propertyName', 'Property Name*', {
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  }),
  createField('outletName', 'Outlet Name', { required: true, placeHolderText: 'ex : Vista' }),
  createField('invoiceamount', 'Invoice Amount*', {
    required: true,
    type: 'number',
    disable: false,
    placeHolderText: 'ex : 2100.00',
  }),
  createField('invoiceNumber', 'Invoice Number*', {
    required: true,
    type: 'string',
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  }),
]
export const posNeucoinsRedemption = [
  ...posCommonFields,
  createField('redeemNeucoins', 'Enter Amount to Redeem', {
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
]
export const posNeuCoinsReInstateFields = [
  ...posCommonFields,
  createField('redemptionId', 'Redemption ID*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : Izjiejjk',
  }),
  createField('reinstateNeucoins', 'Enter Neucoins Amount to Reverse*', {
    type: 'number',
    required: true,
    placeHolderText: 'ex : 1000',
  }),
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    type: 'dropdown',
    required: true,
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Order Cancellation', 'Change in Plans', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]

export const posGCReinstateInstateFields = [
  ...posCommonFields,
  createField(GCNumber, 'GiftCard Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : XXXX XXXX XXXX XXXX',
  }),
  createField('phone', 'Mobile Number*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  }),
  createField('reinstateGiftCard', 'Amount to Reverse*', {
    required: true,
    disable: false,
    type: 'number',
    placeHolderText: 'ex : 1000',
  }),
  createField('originalApprovalCode', 'Original ApprovalCode*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 115152243',
  }),
  createField('originalBatchNumber', 'Original BatchNumber*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 14413770',
  }),
  createField('originalTransactionId', 'Original TransactionId*', {
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 98',
  }),
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    required: true,
    disable: false,
    type: 'dropdown',
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Payment Failure', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]

export const posVoucherReinstateFields = [
  ...posCommonFields,
  createField('reasonforreversal', 'Select Reason for Reversal*', {
    type: 'dropdown',
    required: true,
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Payment Failure', 'Cancelled Booking', 'Manual Adjustment'],
  }),
]
// Helper function to get journey fields based on journeyType
export const getJourneyFields = (journeyType: string, Guest: any) => {
  if (
    journeyType === JOURNEY_TYPES.NEUCOINS_REDEMPTION ||
    journeyType === JOURNEY_TYPES.TEGC_REDEMPTION ||
    journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION
  ) {
    return fields
  }
  if (journeyType === JOURNEY_TYPES.NEUCOINS_REINSTATE) {
    return neuCoinsReInstateFields
  }
  if (journeyType === JOURNEY_TYPES.TEGC_REINSTATE) {
    return gcReinstateInstateFields
  }
  if (journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE) {
    return voucherReinstateFields
  }
  if (journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION) {
    return gcVoucherRedemption
  }
  return ccAvenueGeneratePayments
}
