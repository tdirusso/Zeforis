import { useState, useEffect } from 'react';

export default function useSnackbar() {
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [isOpen]);

  const openSnackBar = (message = 'Something went wrong...', type = 'warning') => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  return {
    isOpen,
    message,
    type,
    openSnackBar
  };
};
