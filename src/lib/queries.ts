export const getFeaturedVouchers = `
  *[_type == "vouchers"]{
    title,
    voucherType,
    participatingHotels[] | order(hotelName asc) | order(coalesce(score, -1) desc) ->{
    "hotelCode" : searchTaxonomies->hotelCode,
    hotelName,
    brandName
    }
  }
`
