import { Box, Divider, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ContextMenuProps } from ".";

export default function TaskContextMenu(props: ContextMenuProps) {
  const {
    closeContextMenu,
    isOpen,
    mouseCoords,
    openDrawer,
    openModal,
    contextMenuProps: { task }
  } = props;

  return (
    <Menu
      transitionDuration={0}
      className="task-actions-menu"
      anchorPosition={{
        top: mouseCoords.y,
        left: mouseCoords.x
      }}
      anchorReference="anchorPosition"
      open={Boolean(isOpen)}
      onClose={() => {
        closeContextMenu();
      }}>
      <MenuItem
        dense
        onClick={() => {
          openDrawer && openDrawer('task', { taskProp: task });
          closeContextMenu();
        }}>
        <EastRoundedIcon fontSize="small" />
        Quick view
      </MenuItem>
      <MenuItem
        onClick={closeContextMenu}
        style={{ color: 'inherit' }}
        dense
        component={Link}
        to={`./tasks/${task?.task_id}`}>
        <FullscreenOutlinedIcon fontSize="small" />
        Full view
      </MenuItem>
      <Divider className="m0" />
      {
        task?.link_url ?
          <Box>
            <MenuItem
              onClick={() => {
                closeContextMenu();
              }}
              style={{ color: 'inherit' }}
              dense
              component="a"
              href={task.link_url} target="_blank">
              <OpenInNewIcon
                fontSize="small"
                style={{ fontSize: 17, width: 20 }} />
              Open resource
            </MenuItem>
            <Divider className="m0" />
          </Box>
          :
          null
      }
      <MenuItem
        dense
        onClick={() => {
          openModal && openModal('delete-tasks', { taskIds: [task.task_id] });
          closeContextMenu();
        }}>
        <ListItemText
          inset
          color="error">
          <Typography color="error" component="span">
            Delete task
          </Typography>
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};
