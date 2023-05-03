import { useState } from 'react';

export default function useSideNav() {
  const [isSideNavOpen, setSideNavOpen] = useState(true);

  const toggleSideNav = () => {
    setSideNavOpen(!isSideNavOpen);
  };

  console.log(isSideNavOpen);

  return {
    isSideNavOpen,
    toggleSideNav
  };
};
