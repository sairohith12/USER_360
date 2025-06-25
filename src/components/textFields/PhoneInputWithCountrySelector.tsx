'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, Autocomplete, InputAdornment, ListItem, ListItemText } from '@mui/material'
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js'
import { FlagIcon } from './FlagIcon'

type CountryOption = {
  name: string
  iso2: string
  dialCode: string
}

const getCountryList = (): CountryOption[] => {
  const countries = getCountries()
  return countries.map((iso2) => ({
    name:
      new Intl.DisplayNames(['en'], { type: 'region' }).of(iso2.toUpperCase()) ||
      iso2.toUpperCase(),
    iso2,
    dialCode: '+' + getCountryCallingCode(iso2),
  }))
}

const favoriteCountries = ['in', 'us', 'ae']

type Props = {
  value: string
  onChange: (fullPhone: string, iso2: string) => void
  error?: string
  setError?: (error: string) => void
}

export const PhoneInputWithCountrySelector: React.FC<Props> = ({
  value,
  onChange,
  error,
  setError,
}) => {
  const countryList = useMemo(() => {
    const list = getCountryList()
    return [
      ...list.filter((c) => favoriteCountries.includes(c.iso2)),
      ...list.filter((c) => !favoriteCountries.includes(c.iso2)),
    ]
  }, [])

  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null)

  useEffect(() => {
    const defaultCountry = countryList.find((c) => c.iso2?.toLowerCase() === 'in') || countryList[0]
    setSelectedCountry(defaultCountry)
  }, [countryList])

  const phoneWithoutDialCode = selectedCountry ? value.replace(selectedCountry.dialCode, '') : value

  const validatePhone = (raw: string) => {
    if (!selectedCountry) return
    const parsed = parsePhoneNumberFromString(`${selectedCountry.dialCode}${raw}`)
    if (parsed?.isValid()) {
      setError?.('')
    } else {
      setError?.('Invalid phone number for selected country')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    if (selectedCountry) {
      const full = `${selectedCountry.dialCode}${rawValue}`
      onChange(rawValue, selectedCountry.dialCode)
      validatePhone(rawValue)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        width: '100%',
      }}
    >
      <Autocomplete
        options={countryList}
        value={selectedCountry}
        onChange={(_, newValue) => {
          if (newValue) {
            setSelectedCountry(newValue)
            const newRaw = value.replace(selectedCountry?.dialCode || '', '')
            const newFull = `${newValue.dialCode}${newRaw}`
            onChange(newFull, newValue.iso2)
            validatePhone(newRaw)
          }
        }}
        getOptionLabel={(option) => `${option.name} (${option.dialCode})`}
        renderOption={(props, option) => (
          <ListItem {...props} key={option.iso2}>
            <FlagIcon iso2={option.iso2} size={24} />
            <ListItemText primary={option.name} secondary={option.dialCode} sx={{ ml: 1 }} />
          </ListItem>
        )}
        isOptionEqualToValue={(option, value) => option.iso2 === value?.iso2}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Country"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {selectedCountry && (
                    <InputAdornment position="start" sx={{ mr: 1 }}>
                      <FlagIcon iso2={selectedCountry.iso2} size={24} />
                    </InputAdornment>
                  )}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
        sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
      />
      <TextField
        label="Phone Number"
        value={phoneWithoutDialCode}
        onChange={handlePhoneChange}
        placeholder="Enter phone number"
        error={!!error}
        helperText={error || ''}
        sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
      />
    </Box>
  )
}
