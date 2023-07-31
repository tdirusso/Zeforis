import { useState } from 'react';

export default function useModal() {
  const [modalToOpen, setModalToOpen] = useState('');
  const [modalProps, setModalProps] = useState({});

  const openModal = (modalType, props) => {
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
