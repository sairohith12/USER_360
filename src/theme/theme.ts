// src/theme/theme.ts
import { createTheme } from '@mui/material/styles'
import { Inter, Cinzel } from 'next/font/google'

// Load fonts with desired subsets and weights
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
})

// Light Theme
const lightTheme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontFamily: cinzel.style.fontFamily },
    h2: { fontFamily: cinzel.style.fontFamily },
    h3: { fontFamily: cinzel.style.fontFamily },
    h4: { fontFamily: cinzel.style.fontFamily },
    h5: { fontFamily: cinzel.style.fontFamily },
    h6: { fontFamily: cinzel.style.fontFamily },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2e3b55',
      50: '#f4f6fa', // soft light blue/gray for hover
      100: '#dde3ed', // light highlight color
    },
    secondary: {
      main: '#ff6f61',
    },
    background: {
      default: '#ffffff',
      paper: '#f4f6fa', // light gray for paper
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
  spacing: 4,
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Autofill style
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px white inset !important',
            boxShadow: '0 0 0 1000px white inset !important',
            WebkitTextFillColor: 'black !important',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f4f6fa', // or use 'primary.50' if theme aware
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f4f6fa',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '100px', // Global height for AppBar
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: '100px', // Global height for Toolbar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          top: '100px', // Adjust drawer so it doesn't overlap with the header
          height: 'calc(100vh - 100px)', // Subtract header height from drawer
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

// Dark Theme
const darkTheme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h1: { fontFamily: cinzel.style.fontFamily },
    h2: { fontFamily: cinzel.style.fontFamily },
    h3: { fontFamily: cinzel.style.fontFamily },
    h4: { fontFamily: cinzel.style.fontFamily },
    h5: { fontFamily: cinzel.style.fontFamily },
    h6: { fontFamily: cinzel.style.fontFamily },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#2e3b55',
      50: '#394b69', // Darker shade for hover
      100: '#3e5a7d', // Dark highlight color
    },
    secondary: {
      main: '#ff6f61',
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark paper color
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  spacing: 4,
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#394b69', // Darker shade for hover
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#394b69',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '100px', // Global height for AppBar
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: '100px', // Global height for Toolbar
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          top: '100px', // Adjust drawer so it doesn't overlap with the header
          height: 'calc(100vh - 100px)', // Subtract header height from drawer
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

export { lightTheme, darkTheme, inter, cinzel }
