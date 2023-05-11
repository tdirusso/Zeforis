import { useState } from 'react';

export default function useDrawer() {
  const [drawerToOpen, setDrawerToOpen] = useState('');
  const [drawerProps, setDrawerProps] = useState({});

  const openDrawer = (drawerType, props) => {
    setDrawerProps(props);
    setDrawerToOpen(drawerType);
  };

  const closeDrawer = () => {
    setDrawerToOpen('');
    setDrawerProps({});
  };

  return {
    drawerToOpen,
    drawerProps,
    openDrawer,
    closeDrawer
  };
};
