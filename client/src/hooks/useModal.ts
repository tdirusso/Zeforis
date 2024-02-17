import { useState } from 'react';

export default function useModal() {
  const [modalToOpen, setModalToOpen] = useState('');
  const [modalProps, setModalProps] = useState<{ [key: string | number]: any; }>({});

  const openModal = (modalType: string, props: { [key: string | number]: any; } = {}) => {
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
