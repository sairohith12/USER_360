// components/ErrorBoundary.tsx
import React, { Component } from 'react';
import { Button, Typography, Box } from '@mui/material';

class ErrorBoundary extends Component<React.PropsWithChildren<object>, { hasError: boolean }> {
  constructor(props: React.PropsWithChildren<object>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught in ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Typography variant="h4" color="error">
            Something went wrong.
          </Typography>
          <Button onClick={this.handleReload} variant="contained" sx={{ mt: 2 }}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
