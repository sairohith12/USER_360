// components/DateInput.tsx
import React from 'react'
import { SxProps, Theme } from '@mui/material'
import dayjs from 'dayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

interface DateInputProps {
  name: string
  label: string
  value: string
  onChange: (name: string, date: Date | null) => void
  error?: boolean
  helperText?: string
  customStyle?: SxProps<Theme>
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  customStyle = {},
}) => {
  const oneWeekAgo = dayjs().subtract(7, 'day')
  return (
    <DesktopDatePicker
      label={label}
      minDate={oneWeekAgo}
      value={value ? dayjs(value) : null}
      format="DD/MM/YYYY"
      onChange={(newDate) => onChange(name, newDate ? newDate.toDate() : null)}
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'medium',
          variant: 'outlined',
          error: error,
          helperText: helperText,
          sx: {
            backgroundColor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: '#d0d7de',
              },
              '&:hover fieldset': {
                borderColor: '#007FFF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#007FFF',
                borderWidth: '2px',
              },
            },
            ...customStyle,
          },
        },
      }}
    />
  )
}

export default DateInput
