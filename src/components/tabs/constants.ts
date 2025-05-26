import { GCNumber, JOURNEY_TYPES } from '../textFields/constants'

export const fields = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'bookingNumber',
    label: 'Itinerary  Number',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
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
    name: 'checkIn',
    label: 'Check-In Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'checkOut',
    label: 'Check-Out Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number',
    type: 'string',
    required: true,
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  },

  {
    name: 'redeemNeucoins',
    label: 'Enter Amount to Redeem',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
]

export const neuCoinsReInstateFields = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'bookingNumber',
    label: 'Itinerary  Number',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
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
    name: 'checkIn',
    label: 'Check-In Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'checkOut',
    label: 'Check-Out Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : WEB_23105',
  },
  {
    name: 'redemptionId',
    label: 'Redemption ID',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : Izjiejjk',
  },

  {
    name: 'reinstateNeucoins',
    label: 'Enter Neucoins Amount to Reverse',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
  {
    name: 'reasonforreversal',
    label: 'Select Reson for reversal',
    required: true,
    type: 'dropdown',
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: ['Order Cancellation', 'Change in Plans', 'Cancelled Booking', 'Manual Adjustment'],
  },
]

export const gcReinstateInstateFields = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: GCNumber,
    label: 'GiftCard Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : XXXX XXXX XXXX XXXX',
  },
  {
    name: 'bookingNumber',
    label: 'Itinerary  Number',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
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
    name: 'checkIn',
    label: 'Check-In Date*',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'checkOut',
    label: 'Check-Out Date*',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : WEB_23105',
  },
  {
    name: 'phone',
    label: 'Mobile Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  },

  {
    name: 'reinstateGiftCard',
    label: 'Amount to Reverse*',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
  {
    name: 'originalApprovalCode',
    label: 'Original ApprovalCode*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 115152243',
  },
  {
    name: 'originalBatchNumber',
    label: 'Original BatchNumber*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 14413770',
  },
  {
    name: 'originalTransactionId',
    label: 'Original TransactionId*',
    required: true,
    type: 'string',
    placeHolderText: 'ex : 98',
  },
  {
    name: 'originalAmount',
    label: 'Original Amount*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 100',
  },
  {
    name: 'reasonforreversal',
    label: 'Select Reason for reversal*',
    required: true,
    type: 'dropdown',
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: [
      // 'Order Cancellation',
      // 'Change in Plans',
      'Payment Failure',
      'Cancelled Booking',
      'Manual Adjustment',
    ],
  },
]

export const voucherReinstateFields = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'bookingNumber',
    label: 'Itinerary Number',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
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
    name: 'checkIn',
    label: 'Check-In Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'checkOut',
    label: 'Check-Out Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number',
    type: 'string',
    required: true,
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  },
  {
    name: 'redeemNeucoins',
    label: 'Enter Amount to ReInstate',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
  {
    name: 'reasonforreversal',
    label: 'Select Reason for reversal*',
    required: true,
    type: 'dropdown',
    placeHolderText: 'ex : Guest didn`t appear at hotel',
    options: [
      // 'Order Cancellation',
      // 'Change in Plans',
      'Payment Failure',
      'Cancelled Booking',
      'Manual Adjustment',
    ],
  },
]

export const ccAvenueGeneratePayments = [
  {
    name: 'propertyName',
    label: 'Property Name*',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'bookingNumber',
    label: 'Itinerary  Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : 21305B0075626',
  },
  {
    name: 'invoiceamount',
    label: 'Invoice Amount*',
    required: true,
    type: 'number',
    disable: false,
    placeHolderText: 'ex : 2100.00',
  },
  {
    name: 'checkIn',
    label: 'Check-In Date*',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'checkOut',
    label: 'Check-Out Date*',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'invoiceNumber',
    label: 'Invoice Number*',
    type: 'string',
    required: true,
    disable: false,
    placeHolderText: 'ex : WEB_23105',
  },

  {
    name: 'guestName',
    label: 'Guest Name*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex: XXX XXX',
  },
  {
    name: 'phone',
    label: 'Mobile Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  },
  {
    name: 'email',
    label: 'Guest Email*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : sxxxxxxx@gmail.com',
  },
  {
    name: 'redeemNeucoins',
    label: 'Enter Amount to be Paid*',
    required: true,
    type: 'number',
    placeHolderText: 'ex : 1000',
  },
]

export const gcVoucherRedemption = [
  {
    name: 'propertyName',
    label: 'Property Name',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'Taj Lands End',
  },
  {
    name: 'newExpiryDate',
    label: 'New Expiry Date',
    required: true,
    type: 'date',
    disable: false,
  },
  {
    name: 'memberID',
    label: 'Member ID*',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'ex : 5173',
  },

  {
    name: 'bitDate',
    label: 'Created On*',
    required: true,
    disable: true,
    type: 'string',
    placeHolderText: 'ex : XXX-XX-XXT00:00:00+05:30',
  },
  {
    name: 'phone',
    label: 'Mobile Number*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : +919966xxxx00',
  },
  {
    name: 'email',
    label: 'Guest Email*',
    required: true,
    disable: false,
    type: 'string',
    placeHolderText: 'ex : sxxxxxxx@gmail.com',
  },
  {
    name: 'reasonforExtension',
    label: 'Select Reson for Extension',
    required: true,
    type: 'dropdown',
    placeHolderText: 'ex : Extended stay due to travel disruption',
    options: ['Order Issue', 'Change in Plans '],
  },
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
