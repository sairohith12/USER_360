import { Modal, Box, IconButton, Typography, Fade, Backdrop, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AnimatedModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showFooter?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(255, 255, 255,0.9)', // Semi-transparent white
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Glowy shadow
  backdropFilter: 'blur(10px)', // Intense blur effect
  WebkitBackdropFilter: 'blur(10px)', // Safari support
  borderRadius: '20px',
  p: { xs: 3, md: 5 },
  width: { xs: '90%', sm: '500px' },
  maxHeight: '90vh',
  overflowY: 'auto',
};

const CustomModal: React.FC<AnimatedModalProps> = ({
  open,
  onClose,
  title,
  children,
  showFooter = false,
  onConfirm,
  confirmText = 'Confirm',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(6px)',
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={modalStyle}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#555',
            }}
          >
            <CloseIcon />
          </IconButton>

          {title && (
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 3,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#222',
              }}
            >
              {title}
            </Typography>
          )}

          <Box>{children}</Box>

          {showFooter && (
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={onClose}
                sx={{ borderRadius: '30px', px: 4 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onConfirm}
                sx={{
                  borderRadius: '30px',
                  background: 'linear-gradient(45deg, #007FFF, #00B8D4)',
                  px: 4,
                }}
              >
                {confirmText}
              </Button>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModal;
