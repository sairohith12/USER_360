// components/FormInput.tsx

import React from 'react'
import { TextField, SxProps, Theme } from '@mui/material'

interface FormInputProps {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: boolean
  helperText?: string
  type?: string
  customStyle?: SxProps<Theme>
  disabled?: boolean
  placeholder?: string
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  value,
  onChange,
  error = false,
  helperText = '',
  type = 'text',
  customStyle = {},
  disabled = false,
  placeholder = '',
}) => {
  return (
    <TextField
      fullWidth
      size="medium"
      variant="outlined"
      autoComplete="off"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      sx={{
        backgroundColor: disabled ? '#f5f5f5' : '#fff',
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
          '&.Mui-disabled fieldset': {
            borderColor: '#ccc',
          },
        },
        ...customStyle,
        // Disable spinner for number input fields
        ...(type === 'number' && {
          "& input[type='number']::-webkit-outer-spin-button, & input[type='number']::-webkit-inner-spin-button":
            {
              display: 'none', // Hide the up and down arrows
            },
        }),
      }}
    />
  )
}

export default FormInput
