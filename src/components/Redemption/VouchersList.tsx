import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  InputBase,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { CheckCircle, AccessTime, Cancel, ExpandMore, Search } from '@mui/icons-material'
import { useGuestContext } from '@/context/guestContext'
import { JOURNEY_TYPES } from '../textFields/constants'
import FormSelect from '../textFields/FormSelect'
import ensureArray from '@/utils/ensureArray'
import { formatDateToYYYYMMDD } from '@/utils/date'
import ClearIcon from '@mui/icons-material/Clear'
import { useEligibleVouchers } from '@/utils/useEligibleVouchers'
import { useAuth } from '@/context/authContext'

type VoucherStatus = 'valid' | 'expired' | 'pending' | 'used' | 'available' | 'cancelled'

const statusStyles: Record<VoucherStatus, { color: string; icon: React.JSX.Element }> = {
  available: {
    color: '#2e7d32',
    icon: <CheckCircle style={{ color: '#2e7d32', marginRight: 4 }} />,
  },
  valid: {
    color: '#2e7d32',
    icon: <CheckCircle style={{ color: '#2e7d32', marginRight: 4 }} />,
  },
  expired: {
    color: '#d32f2f',
    icon: <Cancel style={{ color: '#d32f2f', marginRight: 4 }} />,
  },
  pending: {
    color: '#ed6c02',
    icon: <AccessTime style={{ color: '#ed6c02', marginRight: 4 }} />,
  },
  used: {
    color: '#d32f2f',
    icon: <Cancel style={{ color: '#d32f2f', marginRight: 4 }} />,
  },
  cancelled: {
    color: '#d32f2f',
    icon: <Cancel style={{ color: '#d32f2f', marginRight: 4 }} />,
  },
}

const MEMBERSHIP_LABELS = ['ALL', 'THE CHAMBERS', 'EPICURE', 'HSBC']

const VouchersTab = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [membershipType, setMembershipType] = useState('ALL')
  const { userSelectedProperty } = useAuth()
  const cmsVouchersData = global?.window?.localStorage?.getItem('sanity-special-page-cache')
    ? JSON.parse(global?.window?.localStorage?.getItem('sanity-special-page-cache') || '{}')?.data
        ?.cmsVouchers
    : null
  const { guestLogin, Guest, journeyType } = useGuestContext() as {
    guestLogin: (data: any) => void
    Guest: {
      vouchersResponse?: {
        vouchers?: {
          chamber?: { pendingVouchers?: any[]; redeemedVouchers?: any[] }
          epicure?: { pendingVouchers?: any[]; redeemedVouchers?: any[] }
          hsbc?: { pendingVouchers?: any[]; redeemedVouchers?: any[] }
        }
      }
    }
    journeyType: string
  }
  // const [allVouchers, setAllVouchers] = useState([])
  const voucherAPIData = {
    pendingVouchers: [
      ensureArray(Guest?.vouchersResponse?.vouchers?.chamber?.pendingVouchers),
      ensureArray(Guest?.vouchersResponse?.vouchers?.epicure?.pendingVouchers),
      ensureArray(Guest?.vouchersResponse?.vouchers?.hsbc?.pendingVouchers),
    ]?.flat(),
    redeemedVouchers: [
      ensureArray(Guest?.vouchersResponse?.vouchers?.chamber?.redeemedVouchers),
      ensureArray(Guest?.vouchersResponse?.vouchers?.epicure?.redeemedVouchers),
      ensureArray(Guest?.vouchersResponse?.vouchers?.hsbc?.redeemedVouchers),
    ]?.flat(),
  }

  const isStatusAvailable = journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE

  const vouchersFilteredByStatus = ensureArray(
    isStatusAvailable ? voucherAPIData?.redeemedVouchers : voucherAPIData?.pendingVouchers,
  ) //Getting voucher based on status from the store

  const updatedVouchers = useEligibleVouchers(
    cmsVouchersData,
    vouchersFilteredByStatus,
    userSelectedProperty?.property?.hotel_code,
  )

  useEffect(() => {
    setSelectedTab(0)
    setSearchTerm('')
  }, [membershipType])

  //Filtering vouchers from selected membership in dropdown
  const vouchersFilteredByMembership = updatedVouchers
    ?.map((vouchers: any) =>
      membershipType?.toLocaleLowerCase() === 'all'
        ? vouchers?.vouchers
        : vouchers?.vouchers?.filter(
            (voucher: any) =>
              voucher?.label?.toLocaleLowerCase() === membershipType?.toLocaleLowerCase(),
          ),
    )
    ?.filter((vouchers) => vouchers?.length > 0)
  const filteredData = vouchersFilteredByMembership.filter((similarVoucherList) =>
    similarVoucherList?.[0]?.productName.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  //Getting all the memberships available from the fetch-vouchers
  const membershipLabelsFromResponse = [
    'ALL',
    ...Array.from(
      new Set(
        updatedVouchers
          ?.map((voucherArr: any) =>
            voucherArr?.vouchers?.map((voucher: { label: string }) => voucher?.label),
          )
          ?.flat(),
      ),
    ),
  ]

  //Defaulting All and Neupass and filtering options form fetch-vouchers response
  //TODO: need to write and take it from constants
  const filteredMembershipLabels = MEMBERSHIP_LABELS?.filter(
    (membershipLabel) =>
      membershipLabel?.toLocaleLowerCase() == 'all' ||
      membershipLabelsFromResponse?.findIndex(
        (uniqueMembership) =>
          uniqueMembership?.toLocaleLowerCase() === membershipLabel?.toLocaleLowerCase(),
      ) > -1,
  )

  //Filtering vouchers from selected category in dropdown

  const allVouchers = filteredData[selectedTab] || []

  // const uniqueMemberTypes = Array.from(new Set(allVouchers.map((v) => v.memberType)))

  const handleRedeem = (voucher: (typeof allVouchers)[number]) => {
    guestLogin({
      ...Guest,
      ...voucher,
      isBenefit: 'isBenefit' in voucher ? String(voucher.isBenefit) : undefined,
    })
  }

  return (
    <>
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: '80%' }}>
          <Typography variant="h6" fontWeight={700} color="#2e3b55">
            Priviliges
            {/* & Benefits */}
          </Typography>
          {/* <Box sx={{ display: 'flex', gap: 2 }}> */}
          {/* <Select
              size="small"
              value={membershipType}
              label=""
              onChange={(e) => setMembershipType(e.target.value)}
            >
              {.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select> */}

          <FormSelect
            name={'memberType'}
            label={'Member Type'}
            value={membershipType}
            onChange={(e) => setMembershipType(e.target.value)}
            options={membershipLabelsFromResponse}
            key={'memberType'}
            disabled={false}
            placeholder={'Select Member Type'}
          />
          {/* </Box> */}
        </Box>
      </>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box
          sx={{
            minWidth: 250,
            borderRight: 1,
            borderColor: 'divider',
            overflowY: 'auto',
            height: '100%',
          }}
        >
          <Box sx={{ p: 2 }}>
            <InputBase
              placeholder="Search vouchers..."
              fullWidth
              startAdornment={<Search sx={{ mr: 1 }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endAdornment={
                searchTerm?.length > 0 ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                      aria-label="clear selection"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }
              sx={{
                border: '1px solid #ccc',
                borderRadius: 2,
                px: 2,
                py: 1,
                fontSize: 14,
                backgroundColor: '#fff',
              }}
            />
          </Box>
          <Box
            sx={{
              minWidth: 250,
              maxHeight: '70vh',
              overflowY: 'auto',
              borderRight: 1,
              borderColor: 'divider',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888', // dark thumb
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1', // light track
              },
              scrollbarColor: '#888 #f1f1f1', // for Firefox
              scrollbarWidth: 'thin',
            }}
          >
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={(e, newValue) => {
                setSelectedTab(newValue)
                setMembershipType('ALL') // reset filter on tab change
              }}
              variant="scrollable"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              {filteredData.map((group) => (
                <Tab
                  key={group?.[0]?.productName}
                  label={group?.[0]?.productName}
                  sx={{
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    color: '#2e3b55',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: 4 }}>
          {filteredData[selectedTab] && (
            <>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#2e3b55' }}>
                {filteredData[selectedTab]?.[0]?.productName}
              </Typography>

              <Typography variant="body2" sx={{ mb: 3, color: '#2e3b55' }}>
                {filteredData[selectedTab]?.[0]?.productDescription}
              </Typography>

              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography sx={{ fontWeight: 600 }}>Vouchers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Member Type Filter */}
                  {/* <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Filter by Member Type:
                  </Typography>
                  <select
                    value={membershipType}
                    onChange={(e) => setMembershipType(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1px solid #ccc',
                      fontSize: 14,
                    }}
                  >
                    <option value="ALL">All</option>
                    {uniqueMemberTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Box> */}

                  {/* Voucher Grid */}
                  <Box
                    sx={{
                      flex: 1,
                      maxHeight: '53vh',
                      overflowY: 'auto',
                      p: 4,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#aaa',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#666',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f4f4f4',
                      },
                      scrollbarColor: '#aaa #f4f4f4',
                      scrollbarWidth: 'thin',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: '1fr',
                          sm: '1fr 1fr',
                          md: '1fr 1fr 1fr',
                        },
                        gap: 3,
                      }}
                    >
                      {filteredData[selectedTab]?.map((voucher: any, idx: any) => (
                        <Paper
                          key={idx}
                          elevation={3}
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            // backgroundColor: '#fff',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            // backgroundColor: voucher.isBenefit === true ? '#fff7f2' : '#fff',
                            // border:
                            //   voucher.isBenefit === true ? '1px solidrgb(125, 101, 99)' : 'none',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 2,
                              position: 'relative',
                            }}
                          >
                            <Box>
                              {/* <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, color: '#2e3b55' }}
                              >
                                {voucher.productName}
                              </Typography> */}
                              <Typography variant="body2" color="text.secondary">
                                Member ID: <strong>{voucher.memberID}</strong>
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Member Type: {voucher.label}
                              </Typography>
                              {(JOURNEY_TYPES?.VOUCHERS_REDEMPTION === journeyType ||
                                journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION) && (
                                <Typography variant="body2" color="text.secondary">
                                  Expiry: {formatDateToYYYYMMDD(voucher.validTill)}
                                </Typography>
                              )}
                            </Box>
                            <Chip
                              icon={
                                statusStyles[voucher?.status?.toLowerCase() as VoucherStatus].icon
                              }
                              label={voucher.status?.toLowerCase()}
                              variant="outlined"
                              sx={{
                                color:
                                  statusStyles[voucher.status?.toLowerCase() as VoucherStatus]
                                    .color,
                                borderColor:
                                  statusStyles[voucher.status?.toLowerCase() as VoucherStatus]
                                    .color,
                                textTransform: 'capitalize',
                              }}
                            />
                          </Box>
                          {/* <Divider sx={{ my: 2 }} /> */}
                          {/* <Divider
                          sx={{
                            backgroundColor: voucher.isBenefit ? '#d7d3e3' : 'divider',
                          }}
                        /> */}
                          {/* {
                          <Chip
                            label={voucher.isBenefit === true ? `Benefits` : 'Vouchers'}
                            size="small"
                            sx={{
                              // position: 'absolute',
                              marginTop: '-3vh',
                              // left: '50%',
                              // transform: 'translateX(-50%)',
                              backgroundColor: '#d7d3e3',
                              color: '#000',
                            }}
                          />
                        } */}
                          {/* Center Divider with Benefit Chip */}
                          <Box
                            sx={{
                              position: 'relative',
                              my: 2,
                              textAlign: 'center',
                              paddingY: '1vh',
                            }}
                          >
                            <Divider
                              sx={{
                                backgroundColor:
                                  voucher.productCategory === 'BENEFITS' ? '#d7d3e3' : 'divider',
                                height: 2,
                              }}
                            />

                            <Chip
                              label={voucher.productCategory}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: '-1px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#d7d3e3',
                                color: '#000',
                                fontWeight: 'bold',
                                px: 1.5,
                              }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Privilege Code: {voucher.privilegeCode}
                            </Typography>
                            {JOURNEY_TYPES?.VOUCHERS_REINSTATE === journeyType && (
                              <Typography variant="body2" color="text.secondary">
                                Bit Date:{' '}
                                {voucher.createdOn ? formatDateToYYYYMMDD(voucher.createdOn) : ''}
                              </Typography>
                            )}
                          </Box>
                          {voucher.status?.toLowerCase() === 'available' &&
                            journeyType === JOURNEY_TYPES.VOUCHERS_REDEMPTION && (
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  mt: 2,
                                  backgroundColor: '#2e3b55',
                                  borderRadius: 10,
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#1d2a40' },
                                }}
                                onClick={() => handleRedeem(voucher)}
                              >
                                Redeem
                              </Button>
                            )}
                          {voucher.status?.toLowerCase() === 'used' &&
                            journeyType === JOURNEY_TYPES.VOUCHERS_REINSTATE && (
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  mt: 2,
                                  backgroundColor: '#2e3b55',
                                  borderRadius: 10,
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  '&:hover': { backgroundColor: '#1d2a40' },
                                }}
                                onClick={() => handleRedeem(voucher)}
                              >
                                Re-Instate
                              </Button>
                            )}
                          {journeyType === JOURNEY_TYPES.VOUCHERS_EXPIRY_EXTENSION && (
                            <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                mt: 2,
                                backgroundColor: '#2e3b55',
                                borderRadius: 10,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#1d2a40' },
                              }}
                              onClick={() => handleRedeem(voucher)}
                            >
                              Extend Expiry
                            </Button>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

export default VouchersTab
