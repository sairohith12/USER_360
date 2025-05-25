// components/CombinedModal.tsx
import React from 'react'
import { Modal, Box, Typography, Button } from '@mui/material'
import { Player } from '@lottiefiles/react-lottie-player'

interface CombinedModalProps {
  open: boolean
  onClose: () => void
  type: 'success' | 'failure' // New prop for type (success or failure)
  title?: string
  description?: string
  children?: any
}

const CombinedModal: React.FC<CombinedModalProps> = ({
  open,
  onClose,
  type,
  title,
  description,
  children,
}) => {
  const successAnimation = '/json/success.json' // Success animation URL
  const failureAnimation = '/json/failure.json' // Failure animation URL

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 4,
          p: 4,
          width: 400,
          textAlign: 'center',
        }}
      >
        {/* Choose the animation based on the type (success or failure) */}
        <Player
          autoplay
          loop={true}
          src={type === 'success' ? successAnimation : failureAnimation}
          style={{ height: '200px', width: '200px', margin: '0 auto' }}
        />

        {/* Title & Description based on type */}
        <Typography
          variant="h5"
          fontWeight="bold"
          mt={2}
          mb={1}
          color={type === 'success' ? 'green' : 'error'}
        >
          {title || (type === 'success' ? 'Transaction Successful!' : 'Transaction Failed')}
          {/* Something Went Wrong! */}
        </Typography>
        {children}
        <Typography variant="body1" color="text.secondary" mb={3}>
          {description ||
            (type === 'success'
              ? 'Your transaction completed successfully.'
              : 'Please try again later.')}
        </Typography>

        {/* Button text and color change based on type */}
        <Button
          variant="contained"
          color={type === 'success' ? 'success' : 'error'}
          onClick={onClose}
          sx={{
            paddingX: 4,
            paddingY: 1.2,
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          {type === 'success' ? 'Great! Proceed' : 'Try Again'}
        </Button>
      </Box>
    </Modal>
  )
}

export default CombinedModal
