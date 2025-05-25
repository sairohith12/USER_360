// components/KeyValueList.tsx

import React from 'react'
import { Box, Typography, Stack } from '@mui/material'

interface KeyValueListProps {
  data: { label: string; value: string }[]
}

const KeyValueList: React.FC<KeyValueListProps> = ({ data }) => {
  return (
    <Stack spacing={1} mb={3}>
      {data.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: '#f4f6fa',
            borderRadius: 2,
            px: 2,
            py: 1.5,
          }}
        >
          <Typography variant="body2" fontWeight={500} color="text.secondary">
            {item.label}
          </Typography>
          <Typography
            variant="body2"
            fontWeight="bold"
            color="text.primary"
            sx={{ textAlign: 'right', maxWidth: '70%' }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

export default KeyValueList
