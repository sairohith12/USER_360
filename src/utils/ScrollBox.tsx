import React from 'react'
import { Box, BoxProps } from '@mui/material'

interface ScrollBoxProps extends BoxProps {
  height?: string | number
  width?: string | number
  scrollThumbColor?: string
  scrollTrackColor?: string
  scrollbarWidth?: string
  scrollbarSideLeft?: boolean
  showHorizontalScroll?: boolean
}

const ScrollBox: React.FC<ScrollBoxProps> = ({
  height = '100%',
  width = '100%',
  scrollThumbColor = '#888',
  scrollTrackColor = '#f1f1f1',
  scrollbarWidth = '6px',
  scrollbarSideLeft = false,
  showHorizontalScroll = false,
  children,
  ...rest
}) => {
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: scrollbarSideLeft ? '0px' : scrollbarWidth,
      height: showHorizontalScroll ? scrollbarWidth : '0px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: scrollThumbColor,
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#555',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: scrollTrackColor,
    },
    scrollbarColor: `${scrollThumbColor} ${scrollTrackColor}`,
    scrollbarWidth: 'thin',
  }

  return (
    <Box
      sx={{
        height,
        width,
        overflowY: 'auto',
        overflowX: showHorizontalScroll ? 'auto' : 'hidden',
        direction: scrollbarSideLeft ? 'rtl' : 'ltr',
        '& > *': {
          direction: 'ltr',
        },
        ...scrollbarStyles,
        ...rest.sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}

export default ScrollBox
