import { Paper } from "@mui/material";
import { useLocation, useNavigate, useOutletContext, useParams, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { Box, ListItemButton } from '@mui/material';
import Snackbar from '../../../components/core/Snackbar';
import useSnackbar from '../../../hooks/useSnackbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import React from "react";

export default function FolderPage() {

  const { folderId } = useParams();
  const navigate = useNavigate();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const exitPath = queryParams.get('exitPath');

  const {
    tags,
    folders,
    clientAdmins,
    clientMembers,
    client,
    setTags,
    setTasks,
    foldersMap
  } = useOutletContext();

  const folder = foldersMap[folderId];
  const tasks = folder.tasks;

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  return (
    <Paper sx={{ p: 5 }}>
      <Button onClick={() => navigate(exitPath)}>Back</Button>

      <Box>
        <List dense>
          {
            tasks.map((task, index) => {
              return (
                <React.Fragment key={task.task_id}>
                  <ListItem component={Link} to={`/home/task/${task.task_id}?exitPath=/home/folder/${folderId}`}>
                    <ListItemButton>
                      <ListItemText
                        primary={`${task.task_name}`}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index !== tasks.length - 1 ? <Divider /> : null}
                </React.Fragment>
              );
            })
          }
        </List>
      </Box>


      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Paper>
  );
};
