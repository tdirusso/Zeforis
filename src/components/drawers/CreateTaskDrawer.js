import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Drawer, Grid, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormControl } from "@mui/material";
import { createTask } from '../../api/tasks';
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/tags';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from '../../lib/constants';

export default function CreateTaskDrawer(props) {
  const {
    isOpen,
    close,
    defaultFolder,
    folders,
    engagementMembers,
    engagementAdmins,
    engagement,
    tags,
    setTags,
    setTasks,
    user,
    openSnackBar
  } = props;

  const engagementId = engagement.id;

  const name = useRef();
  const linkUrl = useRef();

  const [isLoading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [folder, setFolder] = useState(defaultFolder || null);
  const [membersAndAdmins] = useState([...engagementAdmins, ...engagementMembers]);

  useEffect(() => {
    setFolder(defaultFolder || null);

    if (isOpen && !isMobile) {
      name.current.focus();
    }
  }, [defaultFolder, isOpen]);

  const tagIdNameMap = {};
  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const handleCreateTask = async () => {
    const nameVal = name.current.value;
    const linkVal = linkUrl.current.value;
    const folderId = folder?.id;
    const assignedToId = assignedTo?.id;

    if (!nameVal) {
      openSnackBar('Please enter a name for the task.');
      return;
    }

    if (!folderId) {
      openSnackBar('Please choose a folder for the task');
      return;
    }

    setLoading(true);

    try {
      const { message, task } = await createTask({
        name: nameVal,
        linkUrl: linkVal,
        assignedToId,
        folderId,
        engagementId,
        tags: selectedTags
      });

      if (task) {
        const now = new Date().toISOString();

        setTasks(tasks => [...tasks, {
          task_id: task.id,
          task_name: nameVal,
          description: '',
          date_created: now,
          created_by_id: user.id,
          status: 'New',
          folder_id: folderId,
          link_url: linkVal,
          assigned_to_id: assignedToId,
          date_completed: null,
          is_key_task: false,
          date_due: null,
          date_last_updated: now,
          tags: selectedTags.length > 0 ? selectedTags.map(t => t.id).join(',') : null,
          assigned_first: assignedTo?.firstName,
          assigned_last: assignedTo?.lastName,
          created_first: user.firstName,
          created_last: user.lastName,
          updated_by_first: user.firstName,
          updated_by_last: user.lastName
        }]);

        openSnackBar('Task created.', 'success');
        handleClose();
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleClose = () => {
    close();
    setTimeout(() => {
      name.current.value = '';
      linkUrl.current.value = '';
      setFolder(null);
      setAssignedTo(null);
      setSelectedTags([]);
      setLoading(false);
    }, 500);
  };

  const handleCreateTag = async e => {
    const key = e.key;
    const newTagValue = e.target.value;

    if (key === 'Enter' && newTagValue) {
      const result = await createTag({
        name: newTagValue,
        engagementId
      });

      if (result.success) {
        const newTag = result.tag;
        setTags(tags => [...tags, newTag]);
        setSelectedTags(tags => [...tags, newTag]);
      } else {
        openSnackBar(result.message, 'error');
      }
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      hideBackdrop
      variant='persistent'
      PaperProps={{ className: 'drawer' }}>
      <DialogContent>
        <Box style={{ marginBottom: '1.5rem' }}>
          <Grid container rowSpacing={2} columnSpacing={1.5}>
            <Grid item xs={12} mb={2}>
              <Box
                style={{
                  display: 'flex',
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <IconButton
                  size='large'
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    left: '-8px',
                  }}>
                  <CloseIcon />
                </IconButton>
                <DialogTitle
                  style={{
                    textAlign: 'center',
                  }}>
                  Create New Task
                </DialogTitle>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                autoFocus={!isMobile}
                disabled={isLoading}
                inputRef={name}
                placeholder='Task name'
                required>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                placeholder='https://'
                InputProps={{
                  startAdornment:
                    <InputAdornment position='start' style={{ transform: 'rotate(-45deg)' }}>
                      <LinkIcon />
                    </InputAdornment>
                }}
                disabled={isLoading}
                inputRef={linkUrl}>
              </TextField>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  options={folders}
                  getOptionLabel={(option) => option.name || ''}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={isLoading}
                  value={folder}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                  onChange={(_, val) => setFolder(val)}
                  renderInput={(params) => (
                    <TextField
                      placeholder='Folder'
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment:
                          <InputAdornment position='start'>
                            <FolderIcon />
                          </InputAdornment>
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  options={membersAndAdmins}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  disabled={isLoading}
                  groupBy={(option) => option.role}
                  onChange={(_, val) => setAssignedTo(val)}
                  value={assignedTo}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Assigned to"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment:
                          <InputAdornment position='start'>
                            <AccountCircleIcon />
                          </InputAdornment>
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  value={selectedTags}
                  options={tags}
                  renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  filterSelectedOptions
                  disableCloseOnSelect
                  onKeyDown={handleCreateTag}
                  disabled={isLoading}
                  onChange={(_, newVal) => setSelectedTags(newVal)}
                  renderInput={(params) => (
                    <TextField
                      helperText="Create new tags by pressing 'Enter'."
                      {...params}
                      placeholder="Tags"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment:
                          <>
                            <InputAdornment position='start'>
                              <LocalOfferIcon />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <LoadingButton
          style={{ marginTop: '1rem' }}
          variant='contained'
          onClick={handleCreateTask}
          type='submit'
          fullWidth
          size='large'
          loading={isLoading}>
          Create Task
        </LoadingButton>
      </DialogContent>
    </Drawer>
  );
};