// components/DateInput.tsx
import React from 'react'
import { SxProps, Theme } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'

interface DateInputProps {
  name: string
  label: string
  value: string
  onChange: (name: string, date: Date | null) => void
  error?: boolean
  helperText?: string
  customStyle?: SxProps<Theme>
  minDate?: Date | string
  maxDate?: Date | string
}

const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  customStyle = {},
  minDate,
  maxDate,
}) => {
  const toDayjs = (date?: Date | string): Dayjs | undefined => (date ? dayjs(date) : undefined)

  const pickerProps: Record<string, any> = {
    label,
    value: value ? dayjs(value) : null,
    format: 'DD/MM/YYYY',
    onChange: (newDate: Dayjs | null) => onChange(name, newDate ? newDate.toDate() : null),
  }

  if (minDate) pickerProps.minDate = toDayjs(minDate)
  if (maxDate) pickerProps.maxDate = toDayjs(maxDate)

  return (
    <DesktopDatePicker
      {...pickerProps}
      slotProps={{
        textField: {
          fullWidth: true,
          size: 'medium',
          variant: 'outlined',
          error,
          helperText,
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
