import { useState } from 'react';

export default function useDialog() {
  const [dialogToOpen, setDialogToOpen] = useState('');
  const [dialogProps, setDialogProps] = useState<{ [key: string | number]: any; }>({});

  const openDialog = (dialogType: string, props: { [key: string | number]: any; } = {}) => {
    setDialogProps(props);
    setDialogToOpen(dialogType);
  };

  const closeDialog = () => {
    setDialogToOpen('');
  };

  return {
    dialogToOpen,
    dialogProps,
    openDialog,
    closeDialog
  };
};