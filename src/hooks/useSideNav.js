import { useState } from 'react';

export default function useSideNav() {
  const [isSideNavOpen, setSideNavOpen] = useState(true);

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  return {
    isSideNavOpen,
    toggleSideNav
  };
};
