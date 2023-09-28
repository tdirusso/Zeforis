import { useState, useEffect } from 'react';

export default function useSnackbar() {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);
  const [snackBarProps, setSnackBarProps] = useState({});

  useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  }, [isOpen]);

  const openSnackBar = (message = 'Something went wrong...', type = 'warning', options = {}) => {
    setMessage(message);
    setType(type);
    setSnackBarProps(options);
    setOpen(true);
  };

  return {
    isOpen,
    message,
    type,
    snackBarProps,
    openSnackBar
  };
};
