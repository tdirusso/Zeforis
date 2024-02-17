import { useState } from 'react';

export default function useSideNav() {
  const initialState = localStorage.getItem('sideNavOpen');
  const [isSideNavOpen, setSideNavOpen] = useState(initialState === 'true' || !initialState);

  const toggleSideNav = () => {
    localStorage.setItem('sideNavOpen', String(!isSideNavOpen));
    setSideNavOpen(!isSideNavOpen);
  };

  return {
    isSideNavOpen,
    toggleSideNav
  };
};
