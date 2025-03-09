import React from 'react';
import { Box, Paper } from '@mui/material';

export interface ModalDialogProps {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Function to call when the modal should close
   */
  onClose: () => void;
  /**
   * The content to display in the modal
   */
  children: React.ReactNode;
  /**
   * The maximum width of the modal
   * @default '500px'
   */
  maxWidth?: string;
  /**
   * The maximum height of the modal
   * @default '80vh'
   */
  maxHeight?: string;
}

/**
 * A reusable modal dialog component for displaying content in a modal overlay
 */
const ModalDialog: React.FC<ModalDialogProps> = ({
  open,
  onClose,
  children,
  maxWidth = '500px',
  maxHeight = '80vh',
}) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: maxWidth,
          width: '100%',
          maxHeight: maxHeight,
          overflowY: 'auto',
          m: 2,
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default ModalDialog;