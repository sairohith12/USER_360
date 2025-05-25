// components/CustomLoader.tsx
import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
`;

const CustomLoader: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
      }}
    >
      <Box sx={{ position: 'relative', width: 120, height: 120 }}>
        {/* Rotating Arc */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '4px solid #007FFF',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: `${rotate} 2s linear infinite`,
          }}
        />

        {/* Pulsating Core */}
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '50%',
            height: '50%',
            backgroundColor: '#007FFF',
            borderRadius: '50%',
            animation: `${pulse} 1.5s ease-in-out infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
        >
          360°
        </Box>
      </Box>

      {/* Loading Text */}
      <Typography
        variant="h6"
        mt={4}
        fontWeight="bold"
        sx={{
          color: '#007FFF',
          textAlign: 'center',
          fontFamily: 'Segoe UI, sans-serif',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {message || 'Loading User 360...'}
      </Typography>
    </Box>
  );
};

export default CustomLoader;

// import { Modal, Backdrop } from "@mui/material";
// <Modal open={loading} BackdropComponent={Backdrop}>
//   <CustomLoader message="Fetching Data..." />
// </Modal>;
