import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { addFolder } from '../../api/folder';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { FormControl } from "@mui/material";

export default function AddTaskModal({ open, setOpen, clientId, folders, clientUsers }) {
  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();
  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState('New');
  const [folderId, setFolderId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [progress, setProgress] = useState(0);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateTask = e => {
    e.preventDefault();

    const nameVal = name.current.value;
    const descriptionVal = description.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new task.', 'error');
      return;
    }

    if (!folderId) {
      openSnackBar('Please select which folder the task should reside in.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { folder, message } = await addFolder({
          name: nameVal,
          description: descriptionVal,
          clientId
        });

        if (folder) {
          setTimeout(() => {
            openSnackBar('Folder created.', 'success');
          }, 300);
          handleClose();
        } else {
          openSnackBar(message, 'error');
          setLoading(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }, 1000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStatus('New');
      setFolderId('');
      setProgress(0);
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the folder name and optional description below.
          </DialogContentText>
          <form onSubmit={handleCreateTask}>
            <Box sx={{ mt: 3, mb: 3 }}>
              <TextField
                label="Name"
                fullWidth
                autoFocus
                disabled={isLoading}
                inputRef={name}
                required
              >
              </TextField>
              <TextField
                label="Desciption (optional)"
                fullWidth
                disabled={isLoading}
                inputRef={description}
                sx={{ mt: 4 }}
              >
              </TextField>

              <TextField
                label="Link URL"
                fullWidth
                disabled={isLoading}
                inputRef={linkUrl}
                sx={{ mt: 4 }}
              >
              </TextField>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={status}
                  label="Status"
                  onChange={e => setStatus(e.target.value)}>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="Next Up">Next Up</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Currently Writing">Currently Writing</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Ready to Implement">Ready to Implement</MenuItem>
                  <MenuItem value="Complete">Complete</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="folder-label">Folder</InputLabel>
                <Select
                  labelId="folder-label"
                  value={folderId}
                  label="Folder"
                  onChange={e => setFolderId(e.target.value)}>
                  {
                    folders.map(folder => {
                      return <MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>;
                    })
                  }
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="assigned-label">Assigned To</InputLabel>
                <Select
                  labelId="assigned-label"
                  value={assignedToId}
                  label="Assigned To"
                  onChange={e => setAssignedToId(e.target.value)}>
                  {
                    clientUsers.map(user => {
                      return <MenuItem key={user.id} value={user.id}>{user.first_name} {user.last_name}</MenuItem>;
                    })
                  }
                </Select>
              </FormControl>
            </Box>
            <Box width={'99%'}>
              <Slider
                defaultValue={0}
                valueLabelDisplay="auto"
                step={5}
                marks={[{ value: 10, label: 'Task Progress' }]}
                min={0}
                max={100}
                value={progress}
                onChange={e => setProgress(e.target.value)}
                valueLabelFormat={val => `${val}%`}
              />
            </Box>
            <DialogActions>
              <Button
                onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                variant='contained'
                onClick={handleCreateTask}
                type='submit'
                loading={isLoading}>
                Create Task
              </LoadingButton>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </div>
  );
};