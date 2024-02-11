import { useState } from 'react';

export default function useModal() {
  const [modalToOpen, setModalToOpen] = useState('');
  const [modalProps, setModalProps] = useState({});

  const openModal = (modalType: string, props?: any) => {
    setModalProps(props);
    setModalToOpen(modalType);
  };

  const closeModal = () => {
    setModalToOpen('');
  };

  return {
    modalToOpen,
    modalProps,
    openModal,
    closeModal
  };
};
