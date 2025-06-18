// components/KeyValueList.tsx

import React, { useState } from 'react'
import { Box, Typography, Stack, Button, Tooltip, IconButton } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
interface KeyValueListProps {
  data: { label: string; value: string; copyButton?: boolean }[]
}

const KeyValueList: React.FC<KeyValueListProps> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const handleCopy = (value: string, index: number) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedIndex(index)
        setTimeout(() => {
          setCopiedIndex(null)
        }, 1500)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }
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
            {item.value}{' '}
            {item?.copyButton && (
              <Tooltip title={copiedIndex === index ? 'Copied' : 'Copy to clipboard'}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(item.value, index)}
                  sx={{ ml: 1 }}
                  aria-label={`Copy ${item.label}`}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Typography>
        </Box>
      ))}
    </Stack>
  )
}

export default KeyValueList
