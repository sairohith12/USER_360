// components/FormSelect.tsx

import React from 'react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material'

interface FormSelectProps {
  name: string
  label: string
  value: string
  onChange: (e: SelectChangeEvent) => void
  options: string[]
  error?: boolean
  helperText?: string
  customStyle?: SxProps<Theme>
  disabled?: boolean
  placeholder?: string
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  error = false,
  helperText = '',
  customStyle = {},
  disabled = false,
  placeholder = 'Select...',
}) => {
  return (
    <FormControl fullWidth variant="outlined" size="medium" sx={{ ...customStyle }}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        disabled={disabled}
        error={error}
        sx={{
          backgroundColor: disabled ? '#f5f5f5' : '#fff',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d0d7de',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007FFF',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#007FFF',
            borderWidth: '2px',
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ccc',
          },
        }}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <span style={{ color: error ? '#d32f2f' : '#6b7280', fontSize: 12 }}>{helperText}</span>
      )}
    </FormControl>
  )
}

export default FormSelect
