import { useState } from 'react';

export default function useSideNav() {
  const [isSideNavOpen, setSideNavOpen] = useState(localStorage.getItem('sideNavOpen') === 'true');

  const toggleSideNav = () => {
    localStorage.setItem('sideNavOpen', !isSideNavOpen);
    setSideNavOpen(!isSideNavOpen);
  };

  return {
    isSideNavOpen,
    toggleSideNav
  };
};
