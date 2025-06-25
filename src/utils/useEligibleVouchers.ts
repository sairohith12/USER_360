import { useMemo } from 'react'

type Product = {
  title: string
  isActive: boolean
  participatingHotels: { hotelCode: string }[] | null
}

type Voucher = {
  productName: string
  code: string
  // other fields
}

type MatchedProduct = {
  title: string
  participatingHotels: { hotelCode: string }[] | null
  vouchers: Voucher[]
}

export const useEligibleVouchers = (
  source1: Product[],
  source2: Voucher[][],
  currentHotelCode: string,
): MatchedProduct[] => {
  return useMemo(() => {
    const normalize = (str: string) => str?.trim()?.toLowerCase()

    // Step 1: Group all inner arrays by their first voucher's productName
    const voucherMap = source2.reduce((acc, voucherGroup) => {
      const first = voucherGroup?.[0]
      if (!first?.productName) return acc
      const key = normalize(first.productName)
      acc[key] = voucherGroup
      return acc
    }, {} as Record<string, Voucher[]>)

    // Step 2: Match to active source1 products
    return source1
      .filter((product) => product)
      .map((product) => {
        const key = normalize(product.title)
        const vouchers = voucherMap[key]
        if (!vouchers) return null
        const isParticipating =
          product.participatingHotels === null ||
          product.participatingHotels.some((entry) => entry.hotelCode === currentHotelCode)

        if (!isParticipating) return null

        return {
          title: product.title,
          participatingHotels: product.participatingHotels,
          vouchers,
        }
      })
      .filter(Boolean) as MatchedProduct[]
  }, [source1, source2, currentHotelCode])
}
