import { useState } from 'react';

export default function useDrawer() {
  const [drawerToOpen, setDrawerToOpen] = useState('');

  const openDrawer = (drawerType) => {
    setDrawerToOpen(drawerType);
  };

  const closeDrawer = () => {
    setDrawerToOpen('');
  };

  return {
    drawerToOpen,
    openDrawer,
    closeDrawer
  };
};
