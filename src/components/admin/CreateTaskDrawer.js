import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import { Autocomplete, Box, Drawer, Grid, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormControl } from "@mui/material";
import { createTask } from '../../api/tasks';
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/clients';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';

export default function CreateTaskDrawer(props) {
  const {
    isOpen,
    close,
    folderToSet,
    folders,
    clientMembers,
    clientAdmins,
    client,
    tags,
    setTags,
    setTasks,
    user,
    openSnackBar
  } = props;

  const clientId = client.id;

  const name = useRef();
  const linkUrl = useRef();

  const [isLoading, setLoading] = useState(false);
  const [folderId, setFolderId] = useState(null);
  const [assignedToId, setAssignedToId] = useState(null);
  const [assignedToName, setAssignedToName] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const tagIdNameMap = {};

  tags.forEach(tag => tagIdNameMap[tag.id] = tag.name);

  const handleCreateTask = async () => {
    const nameVal = name.current.value;
    const linkVal = linkUrl.current.value;
    const folderIdVal = folderId || folderToSet?.id;

    if (!nameVal) {
      openSnackBar('Please enter a name for the task.');
      return;
    }

    if (!folderIdVal) {
      openSnackBar('Please select a folder for the task');
      return;
    }

    setLoading(true);

    try {
      const { message, task } = await createTask({
        name: nameVal,
        linkUrl: linkVal,
        assignedToId,
        folderId: folderIdVal,
        clientId,
        tags: selectedTags
      });

      if (task) {
        setTimeout(() => {
          openSnackBar('Task created.', 'success');
        }, 300);

        const now = new Date().toISOString();

        setTasks(tasks => [...tasks, {
          task_id: task.id,
          task_name: nameVal,
          description: '',
          date_created: now,
          created_by_id: user.id,
          status: 'New',
          folder_id: folderIdVal,
          link_url: linkVal,
          assigned_to_id: assignedToId,
          progress: 0,
          date_completed: null,
          is_key_task: false,
          date_due: null,
          date_last_updated: now,
          tags: selectedTags.length > 0 ? selectedTags.map(t => t.id).join(',') : null,
          assigned_first: assignedToName?.firstName || null,
          assigned_last: assignedToName?.lastName || null,
          created_first: user.firstName,
          created_last: user.lastName,
          updated_by_first: user.firstName,
          updated_by_last: user.lastName
        }]);

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
      setFolderId(null);
      setAssignedToId(null);
      setSelectedTags([]);
      setLoading(false);
    }, 500);
  };

  const handleAssignedToChange = (_, val) => {
    setAssignedToName(val ?
      {
        firstName: val.firstName,
        lastName: val.lastName
      } :
      null);

    setAssignedToId(val?.id || null);
  };

  const handleCreateTag = async e => {
    const key = e.key;
    const newTagValue = e.target.value;

    if (key === 'Enter' && newTagValue) {
      const result = await createTag({
        name: newTagValue,
        clientId
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
    <div>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        hideBackdrop
        variant='persistent'
        PaperProps={{ sx: { width: '450px' } }}>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container rowSpacing={2} columnSpacing={1.5}>
              <Grid item xs={12} mb={2}>
                <Box
                  display="flex"
                  position="relative"
                  alignItems="center"
                  justifyContent="center">
                  <IconButton
                    size='large'
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      left: '-8px',
                    }}>
                    <CloseIcon />
                  </IconButton>
                  <DialogTitle
                    sx={{
                      textAlign: 'center',
                    }}>
                    Create New Task
                  </DialogTitle>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoFocus
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
                      <InputAdornment position='start' sx={{ transform: 'rotate(-45deg)' }}>
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
                    disabled={Boolean(folderToSet) || isLoading}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                    defaultValue={folderToSet || null}
                    onChange={(_, newVal) => setFolderId(newVal?.id || null)}
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
                    options={[...clientAdmins, ...clientMembers]}
                    renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    disabled={isLoading}
                    groupBy={(option) => option.role}
                    onChange={handleAssignedToChange}
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
            sx={{ mt: '10px' }}
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
    </div>
  );
};