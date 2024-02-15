
import './styles.scss';
import TaskContextMenu from './taskContextMenu';
import { AppContext } from 'src/types/AppContext';

export type ContextMenuProps = {
  contextMenuToOpen?: string,
  contextMenuProps?: any,
  closeContextMenu: () => void,
  mouseCoords: {
    x: number,
    y: number;
  };
  isOpen?: boolean;
  openDrawer?: AppContext['openDrawer'],
  openModal?: AppContext['openModal'];
};

export default function ContextMenus(props: ContextMenuProps) {
  const {
    contextMenuToOpen,
    contextMenuProps,
    closeContextMenu,
    mouseCoords,
    openDrawer,
    openModal
  } = props;

  return (
    <>
      <TaskContextMenu
        isOpen={contextMenuToOpen === 'task'}
        closeContextMenu={closeContextMenu}
        mouseCoords={mouseCoords}
        contextMenuProps={contextMenuProps}
        openDrawer={openDrawer}
        openModal={openModal}
      />
    </>
  );
};
