import { useState } from 'react';

export default function useContextMenu() {
  const [contextMenuToOpen, setContextMenuToOpen] = useState('');
  const [contextMenuProps, setContextMenuProps] = useState({});
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const openContextMenu = (event, contextMenuType, props) => {
    event.preventDefault();

    if (props) {
      setContextMenuProps(props);
    }

    setContextMenuToOpen(contextMenuType);
    setMouseCoords({
      x: event.clientX,
      y: event.clientY
    });
  };

  const closeContextMenu = () => {
    setContextMenuToOpen('');
  };

  return {
    contextMenuToOpen,
    contextMenuProps,
    mouseCoords,
    openContextMenu,
    closeContextMenu
  };
};
