import { useState } from 'react';

export default function useDrawer() {
  const [drawerToOpen, setDrawerToOpen] = useState('');
  const [drawerProps, setDrawerProps] = useState({});

  const openDrawer = (drawerType, props) => {
    if (drawerToOpen === 'getting-started') {
      localStorage.setItem('gsDrawerToReopen', drawerToOpen);
    } else {
      localStorage.removeItem('gsDrawerToReopen');
    }

    if (props) {
      setDrawerProps(props);
    }

    setDrawerToOpen(drawerType);
  };

  const closeDrawer = () => {
    if (localStorage.getItem('gsDrawerToReopen')) {
      setDrawerProps({});
      setDrawerToOpen(localStorage.getItem('gsDrawerToReopen'));
      localStorage.removeItem('gsDrawerToReopen');
    } else {
      setDrawerToOpen('');
      setDrawerProps({});
    }
  };

  return {
    drawerToOpen,
    drawerProps,
    openDrawer,
    closeDrawer
  };
};
