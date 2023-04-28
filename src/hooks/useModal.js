import { useState } from 'react';

export default function useModal() {
  const [modalToOpen, setModalToOpen] = useState('');

  const openModal = (modalType) => {
    setModalToOpen(modalType);
  };

  const closeModal = () => {
    setModalToOpen('');
  };

  return {
    modalToOpen,
    openModal,
    closeModal
  };
};
