
import './styles.scss';
import TaskContextMenu from './taskContextMenu';

export default function ContextMenus(props) {
  const {
    contextMenuToOpen,
    contextMenuProps,
    closeContextMenu,
    mouseCoords
  } = props;

  return (
    <>
      <TaskContextMenu
        isOpen={contextMenuToOpen === 'task'}
        close={closeContextMenu}
        mouseCoords={mouseCoords}
        contextMenuProps={contextMenuProps}
        {...props}
      />
    </>
  );
};
