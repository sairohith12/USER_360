import { Dayjs } from 'dayjs'
import React, { createContext, useState, useContext, ReactNode } from 'react'

// Define types for the Guest data
interface Guest {
  [key: string]: string | number | null | undefined | Dayjs
}
//  {
//   firstName: string;
//   lastName: string;
//   neucoins: number;
//   mobileNumber: string;
//   countryCode: string;
// }

interface GuestContextType {
  Guest: Guest | null
  isGuestLoggedIn: boolean
  journeyType: string | ''
  guestLogin: (GuestDetails: Guest) => void
  guestLogout: () => void
  updatedJourneyType: (journeyType: GuestContextType['journeyType']) => void
  updateGuestVouchers: (vouchers: any) => void
}

// Create the context
const GuestContext = createContext<GuestContextType | undefined>(undefined)

// GuestContext Provider
export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Guest, setGuest] = useState<Guest | null>(null)
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false)
  const [journeyType, setJourneyType] = useState<string>('')

  const guestLogin = (GuestDetails: Guest) => {
    setGuest(GuestDetails)
    setIsGuestLoggedIn(true)
  }

  const guestLogout = () => {
    setGuest(null)
    setIsGuestLoggedIn(false)
  }

  const updatedJourneyType = (journeyType: GuestContextType['journeyType']) => {
    setJourneyType(journeyType)
  }

  const updateGuestVouchers = (vouchers: any) => {
    setGuest((prevGuest) => ({
      ...prevGuest,
      vouchersResponse: vouchers,
    }))
    setIsGuestLoggedIn(true)
  }

  return (
    <GuestContext.Provider
      value={{
        Guest,
        journeyType,
        isGuestLoggedIn,
        guestLogin,
        guestLogout,
        updatedJourneyType,
        updateGuestVouchers,
      }}
    >
      {children}
    </GuestContext.Provider>
  )
}

// Custom hook to use the context
export const useGuestContext = (): GuestContextType => {
  const context = useContext(GuestContext)
  if (!context) {
    throw new Error('useGuestContext must be used within a GuestProvider')
  }
  return context
}
