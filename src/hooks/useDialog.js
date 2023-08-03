import { useState } from 'react';

export default function useDialog() {
  const [dialogToOpen, setDialogToOpen] = useState('');
  const [dialogProps, setDialogProps] = useState({});

  const openDialog = (dialogType, props) => {
    setDialogProps(props);
    setDialogToOpen(dialogType);
  };

  const closeDialog = () => {
    setDialogToOpen('');
    setDialogProps({});
  };

  return {
    dialogToOpen,
    dialogProps,
    openDialog,
    closeDialog
  };
};
