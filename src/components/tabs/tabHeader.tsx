import React from 'react'
import { Tabs, Tab, Box } from '@mui/material'
import { useGuestContext } from '@/context/guestContext'

interface TabsHeaderProps {
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ value, onChange }) => {
  const { Guest } = useGuestContext()
  return (
    <Box sx={{ backgroundColor: 'primary.main', borderRadius: 2, boxShadow: 2 }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="fullWidth"
        textColor="inherit"
        TabIndicatorProps={{
          style: { backgroundColor: 'white', height: 3 },
        }}
      >
        <Tab label="ROOM" sx={{ color: 'white' }} />
        <Tab label="POS" sx={{ color: 'white' }} />
      </Tabs>
    </Box>
  )
}

export default TabsHeader
