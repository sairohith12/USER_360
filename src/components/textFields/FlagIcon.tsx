/* eslint-disable @next/next/no-img-element */

import React from 'react'

export const FlagIcon: React.FC<{ iso2: string; size?: number }> = ({ iso2, size = 20 }) => {
  return (
    <img
      src={`https://flagcdn.com/w40/${iso2.toLowerCase()}.png`}
      alt={iso2}
      width={size}
      height={size * 0.75}
      style={{ borderRadius: 2 }}
    />
  )
}
