import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import { FormControl } from "@mui/material";
import { addTask } from '../../api/task';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { addTags } from '../../api/client';

export default function AddTaskModal({ open, setOpen, folders, clientUsers, clientId, tags, setTags }) {
  const name = useRef();
  const description = useRef();
  const linkUrl = useRef();
  const newTags = useRef();

  const [isLoading, setLoading] = useState(false);
  const [status, setStatus] = useState('New');
  const [folderId, setFolderId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [progress, setProgress] = useState(0);
  const [tagIds, setTagIds] = useState([]);
  const [isAddingTags, setIsAddingTags] = useState(false);

  const tagIdNameMap = {};

  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

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
        const { success, id, message } = await addTask({
          name: nameVal,
          description: descriptionVal,
          linkUrl: linkUrl.current.value,
          status,
          assignedToId,
          progress,
          folderId,
          clientId
        });

        if (success) {
          console.log(id);
          setTimeout(() => {
            openSnackBar('Task created.', 'success');
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


  const handleAddTags = () => {
    const newTagsVal = newTags.current.value;

    if (newTagsVal) {
      const newTagsArray = newTagsVal.split(',');

      setIsAddingTags(true);

      setTimeout(async () => {
        const result = await addTags({
          tags: newTagsArray,
          clientId
        });

        if (result.success) {
          const insertedTags = result.tags;
          const addedIds = insertedTags.map(tag => tag.id);

          setTags(tags => [...tags, ...insertedTags]);
          setTagIds(tagIds => [...tagIds, ...addedIds]);
          setIsAddingTags(false);
          newTags.current.value = '';
        } else {
          openSnackBar(result.message, 'error');
          setIsAddingTags(false);
        }
      }, 1000);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStatus('New');
      setFolderId('');
      setProgress(0);
      setAssignedToId('');
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                label="Assigned To"
                onChange={e => setAssignedToId(e.target.value)}>
                {
                  clientUsers.map(user => {
                    return <MenuItem key={user.id} value={user.id}>{user.first_name} {user.last_name}</MenuItem>;
                  })
                }
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel id="tags-label">Tags</InputLabel>
              <Select
                labelId="tags-label"
                value={tagIds}
                disabled={isLoading}
                label="Tags"
                multiple
                onChange={e => setTagIds(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      return (
                        <Chip
                          key={value}
                          label={tagIdNameMap[value]}
                          onMouseDown={e => e.stopPropagation()}
                          onDelete={() => console.log('test')} />
                      );
                    })}
                  </Box>
                )}>
                {
                  tags.map(tag => {
                    return <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>;
                  })
                }
              </Select>
            </FormControl>
            <Box sx={{ mt: 1 }}>
              <Input
                variant='standard'
                size='small'
                placeholder='Tag 1, Tag 2...'
                fullWidth
                inputRef={newTags}
                disabled={isAddingTags || isLoading}
                endAdornment={
                  <InputAdornment position="end">
                    <LoadingButton
                      onClick={handleAddTags}
                      loading={isAddingTags}
                      size='small'>
                      Add Tags
                    </LoadingButton>
                  </InputAdornment>
                }
              ></Input>
              <Typography variant='caption'>
                If you need to add new tags, type them into the text field above, comma separated, and click "Add Tags".
              </Typography>
            </Box>
          </Box>
          <Box width={'95%'}>
            <Slider
              defaultValue={0}
              valueLabelDisplay="auto"
              step={5}
              marks={[{ value: 2, label: '0%' }, { value: 97, label: '100%' }]}
              min={0}
              max={100}
              disabled={isLoading}
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