import { AlertColor } from '@mui/material';
import { useState, useEffect } from 'react';

export default function useSnackbar() {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<AlertColor>('warning');
  const [snackbarProps, setSnackbarProps] = useState({});

  useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  }, [isOpen]);

  const openSnackBar = (message = 'Something went wrong...', type: AlertColor = 'warning', options = {}) => {
    setMessage(message);
    setType(type);
    setSnackbarProps(options);
    setOpen(true);
  };

  return {
    isOpen,
    message,
    type,
    snackbarProps,
    openSnackBar
  };
};
