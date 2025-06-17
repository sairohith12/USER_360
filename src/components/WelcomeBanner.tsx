import { Paper, Typography, Box } from '@mui/material'
import { useAuth } from '@/context/authContext'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const WelcomeBanner = () => {
  const { user, userType, userSelectedProperty } = useAuth()

  // const getGreetingMessage = ({
  //   name,
  //   hotelName,
  //   role,
  //   useIHCLBrand = true,
  // }: {
  //   name?: string
  //   hotelName?: string
  //   role?: string
  //   useIHCLBrand?: boolean
  // }) => {
  //   const hour = new Date().getHours()
  //   const userName = name ? `${name},` : ''
  //   const hotel = hotelName ? ` at ${hotelName}` : ''
  //   const prefix = useIHCLBrand ? 'Namaste from IHCL! ' : ''

  //   if (role?.toLowerCase() === 'super_admin')
  //     return `${prefix}Welcome, Super Admin 👑 — your control center is ready${hotel}.`

  //   if (role?.toLowerCase() === 'admin')
  //     return `${prefix}Hello Manager! Let’s elevate the guest experience${hotel}.`

  //   if (hour < 12)
  //     return `${prefix}Good morning ${userName} wishing you a smooth and productive start${hotel}!`
  //   if (hour < 17)
  //     return `${prefix}Good afternoon ${userName} hope everything is running well${hotel}.`
  //   return `${prefix}Good evening ${userName} you're all set to manage the day’s wrap-up${hotel}.`
  // }

  const getGreetingHeading = (name?: string, role?: string, useIHCLBrand = true) => {
    const prefix = useIHCLBrand ? 'Namaste !' : ''
    const userName = name ? `${name}` : ''

    if (role?.toLowerCase() === 'super_admin')
      return `${prefix} Welcome, ${userName} — Command Central Ready 👑`

    if (role?.toLowerCase() === 'manager') return `${prefix} Hello Manager`

    return `${prefix} Good to see you, ${userName}`
  }

  const getGreetingDescription = (hotelName?: string, role?: string) => {
    const hour = new Date().getHours()
    const hotelText = hotelName ? ` for ${hotelName}` : ''

    if (role?.toLowerCase() === 'super_admin') {
      if (hour < 12)
        return `Begin your strategic oversight this morning. All modules are within your reach${hotelText}.`
      if (hour < 17)
        return `Oversee operations and manage user controls with confidence this afternoon${hotelText}.`
      return `Time to review the day’s outcomes and refine the flow of operations${hotelText}.`
    }

    if (hour < 12) return `Wishing you a smooth and productive morning${hotelText}.`
    if (hour < 17) return `Hope everything is running well${hotelText} this afternoon.`
    return `You're all set to wrap up the day efficiently${hotelText}.`
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 60vh)" // Subtract header height if needed
      px={2}
    >
      <Paper
        elevation={1}
        sx={{
          px: 4,
          py: 3,
          borderRadius: 3,
          border: '1px solid #dde3ed',
          backgroundColor: '#f4f6fa',
          width: 'fit-content',
          maxWidth: '90vw',
        }}
      >
        {/* <Typography variant="h5" fontWeight="600" gutterBottom>
          {getGreeting()}, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You're logged in as{' '}
          <strong>{userType?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</strong>
          {userSelectedProperty?.property?.hotel_name &&
            ` at ${userSelectedProperty.property.hotel_name}`}
          .
        </Typography> */}
        {/* <Typography variant="h5" fontWeight="600" gutterBottom>
          {getGreetingMessage({
            name: user?.firstName,
            hotelName: userSelectedProperty?.property?.hotel_name,
            role: userType,
            useIHCLBrand: true, // Set false if you want generic
          })}
        </Typography> */}
        <Typography variant="h5" fontWeight="600" gutterBottom>
          {getGreetingHeading(user?.firstName, userType || 'admin')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getGreetingDescription(userSelectedProperty?.property?.hotel_name, userType || 'admin')}
        </Typography>
      </Paper>
    </Box>
  )
}

export default WelcomeBanner
