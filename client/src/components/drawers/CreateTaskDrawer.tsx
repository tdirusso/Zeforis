import DialogContent from '@mui/material/DialogContent';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Checkbox, Chip, CircularProgress, Divider, Drawer, FormControlLabel, IconButton, Menu, MenuItem, Paper, TextField, Tooltip } from '@mui/material';
import { FormControl } from "@mui/material";
import { createTask } from '../../api/tasks';
import InputAdornment from '@mui/material/InputAdornment';
import { createTag } from '../../api/tags';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from '../../lib/constants';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { statuses } from '../../lib/constants';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { createFolder } from '../../api/folders';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Folder } from '@shared/types/Folder';
import { User } from '@shared/types/User';
import { Engagement } from '@shared/types/Engagement';
import { Tag } from '@shared/types/Tag';
import { AppContext } from 'src/types/AppContext';
import { Moment } from 'moment';
import { Task } from '@shared/types/Task';

type CreateTaskDrawerProps = {
  isOpen: boolean,
  closeDrawer: () => void,
  folders: Folder[],
  engagementMembers: User[],
  engagementAdmins: User[],
  engagement: Engagement,
  tags: Tag[],
  setTags: AppContext['setTags'],
  setTasks: AppContext['setTasks'],
  user: User,
  openSnackBar: AppContext['openSnackBar'],
  setFolders: AppContext['setFolders'],
  defaultFolder: Folder | null;
};

export default function CreateTaskDrawer(props: CreateTaskDrawerProps) {

  const {
    isOpen,
    closeDrawer,
    folders,
    engagementMembers,
    engagementAdmins,
    engagement,
    tags,
    setTags,
    setTasks,
    user,
    openSnackBar,
    setFolders,
    defaultFolder
  } = props;

  const engagementId = engagement.id;

  const name = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);
  const linkUrl = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [assignedTo, setAssignedTo] = useState<User | null>(null);
  const [folder, setFolder] = useState(defaultFolder || null);
  const [dateDue, setDateDue] = useState<Moment | null>(null);
  const [isKeyTask, setIsKeyTask] = useState(false);
  const [status, setStatus] = useState('New');
  const [membersAndAdmins] = useState([...engagementAdmins, ...engagementMembers]);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState<Element | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [addFolderPopup, setAddFolderPopup] = useState<Element | null>(null);
  const [addingFolder, setAddingFolder] = useState(false);

  const statusMenuOpen = Boolean(statusMenuAnchor);
  const addFolderPopupOpen = Boolean(addFolderPopup);

  const newFolderName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFolder(defaultFolder || null);

    if (isOpen && !isMobile) {
      name.current?.focus();
    }
  }, [defaultFolder, isOpen]);

  const handleCreateFolder = async () => {
    const folderName = newFolderName.current?.value;

    if (!folderName) {
      openSnackBar("Folder name can't be blank.");
      return;
    }

    setAddingFolder(true);

    try {
      const { folder, message } = await createFolder({
        name: folderName,
        engagementId: engagement.id,
      });

      if (folder) {
        openSnackBar('Folder added.', 'success');

        setFolders(folders => [...folders, folder]);
        setAddingFolder(false);
        setAddFolderPopup(null);
        setTimeout(() => {
          setFolder(folder);
        }, 0);
      } else {
        openSnackBar(message, 'error');
        setAddingFolder(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setAddingFolder(false);
      }
    }
  };

  const handleCreateTask = async () => {
    if (isLoading) {
      openSnackBar('Task is being created.');
      return;
    }

    const nameVal = name.current?.value;
    const descriptionVal = description.current?.value;
    const linkVal = linkUrl.current?.value;
    const folderId = folder?.id;
    const assignedToId = assignedTo?.id;

    const errors: string[] = [];

    if (!nameVal) {
      errors.push('name');
    }

    if (errors.length) {
      setFormErrors(errors);
      openSnackBar('Task name and folder are required.');
      return;
    }

    if (dateDue && !dateDue.isValid()) {
      openSnackBar('Due date is invalid.');
      return;
    }

    setLoading(true);

    try {
      const { message, task, uiProps } = await createTask({
        name: nameVal,
        linkUrl: linkVal,
        description: descriptionVal,
        status,
        assignedToId,
        folderId,
        engagementId,
        tags: selectedTags,
        isKeyTask,
        dateDue
      });

      if (task) {
        const now = new Date().toISOString();

        setTasks(tasks => [...tasks, {
          task_id: task.id,
          task_name: nameVal!,
          description: descriptionVal,
          date_created: now,
          created_by_id: user.id,
          status: status,
          folder_id: task.folderId,
          link_url: linkVal,
          assigned_to_id: assignedToId,
          date_completed: status === 'Complete' ? now : null,
          is_key_task: Boolean(isKeyTask),
          date_due: dateDue ? dateDue.toISOString() : null,
          date_last_updated: now,
          tags: selectedTags.length > 0 ? selectedTags.map(t => t.id).join(',') : null,
          assigned_first: assignedTo?.firstName || null,
          assigned_last: assignedTo?.lastName || null,
          created_first: task.created_first,
          created_last: task.created_last,
          updated_by_first: user.firstName,
          updated_by_last: user.lastName
        }]);

        openSnackBar('Task created.', 'success');
        handleClose();
      } else {
        if (uiProps && uiProps.alertType === 'upgrade') {
          openSnackBar(message, 'error', {
            actionName: 'Upgrade Now',
            actionHandler: () => {
              handleClose();
              navigate('settings/account/billing');
            }
          });
        } else {
          openSnackBar(message, 'error');
        }
        setLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    closeDrawer();
    setTimeout(() => {
      if (name.current) name.current.value = '';
      if (linkUrl.current) linkUrl.current.value = '';
      if (description.current) {
        description.current.value = '';
        description.current.style.height = 'auto';
      }
      setFolder(null);
      setAssignedTo(null);
      setSelectedTags([]);
      setStatus('New');
      setIsKeyTask(false);
      setDateDue(null);
      setLoading(false);
    }, 500);
  };

  const handleCreateTag = async (e: KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    const newTagValue = (e.target as HTMLInputElement).value;

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

  const handleStatusChange = (status: string) => {
    setStatus(status);
    setStatusMenuAnchor(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && formErrors.includes('name')) {
      setFormErrors(prev => prev.filter(er => er !== 'name'));
    }
  };

  const handleFolderChange = (_: React.SyntheticEvent, newVal: Folder | null) => {
    setFolder(newVal);
  };

  return (
    <Drawer
      className='task-drawer'
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      hideBackdrop
      variant='persistent'
      PaperProps={{
        className: 'drawer'
      }}>
      <Paper className='p0 close-btn br50'>
        <Tooltip title="Cancel" placement='top'>
          <IconButton onClick={handleClose} disabled={isLoading}>
            <CloseIcon color={isLoading ? 'disabled' : 'error'} />
          </IconButton>
        </Tooltip>
      </Paper>
      <Paper className='p0 save-btn br50' >
        <Tooltip title="Save">
          <IconButton onClick={handleCreateTask}>
            {
              isLoading ?
                <CircularProgress size='20px' /> :
                <CheckIcon htmlColor='#00c975' />
            }
          </IconButton>
        </Tooltip>
      </Paper>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Box className='close-btn-mobile'>
          <Tooltip title='Close'>
            <IconButton
              onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className='task-content'>
          <Box>
            <TextField
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateTask();
                }
              }}
              onChange={handleNameChange}
              error={formErrors.includes('name')}
              fullWidth
              placeholder='Task name'
              variant="standard"
              inputRef={name}
              multiline
              disabled={isLoading}
              inputProps={{
                style: { fontSize: '1.25rem' }
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" mt={2.5}>
          <Chip
            disabled={isLoading}
            label={status}
            deleteIcon={<MoreVertIcon />}
            onClick={e => setStatusMenuAnchor(e.currentTarget)}
            style={{
              marginRight: '2rem',
              cursor: 'pointer'
            }}
            onDelete={e => setStatusMenuAnchor(e.currentTarget)}
            className={status}
          />
          <Menu
            anchorEl={statusMenuAnchor}
            open={statusMenuOpen}
            onClose={() => setStatusMenuAnchor(null)}>
            {
              statuses.map(({ name }) => {
                return (
                  <MenuItem
                    key={name}
                    onClick={() => handleStatusChange(name)}>
                    <Chip
                      label={name}
                      className={name}
                      style={{ cursor: 'pointer' }}
                    />
                  </MenuItem>
                );
              })
            }
          </Menu>

          <FormControlLabel
            componentsProps={{ typography: { fontWeight: '300' } }}
            control={<Checkbox
              disabled={isLoading}
              icon={<StarBorderIcon />}
              checkedIcon={<StarIcon htmlColor='gold' />}
              checked={isKeyTask}
              onChange={(_, val) => setIsKeyTask(val)}
            />}
            label="Key task"
          />
        </Box>

        <Divider style={{ marginTop: '2rem' }} />
        <Box my={3}>
          <TextField
            disabled={isLoading}
            fullWidth
            placeholder='Description'
            variant="standard"
            multiline
            inputRef={description}
            inputProps={{ style: { resize: 'vertical' } }}
          />
        </Box>
        <Divider />
        <Box my={4}>
          <Box my={2}>
            <TextField
              helperText='Resource link'
              disabled={isLoading}
              fullWidth
              placeholder='https://...'
              variant="standard"
              inputRef={linkUrl}
              InputProps={{
                startAdornment:
                  <InputAdornment position='start' style={{ transform: 'rotate(-45deg)' }}>
                    <LinkIcon />
                  </InputAdornment>
              }}
            />
          </Box>
        </Box>
        <Divider />
        <Box my={4} maxWidth="300px">
          <Box my={2}>
            <FormControl fullWidth>
              <Autocomplete
                disabled={isLoading}
                options={folders}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={folder}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                onChange={handleFolderChange}
                renderInput={(params) => (
                  <TextField
                    placeholder='Folder'
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment:
                        <InputAdornment position='start'>
                          <FolderIcon />
                        </InputAdornment>,
                      endAdornment:
                        <Box>
                          {params.InputProps.endAdornment}
                          <InputAdornment position='end'>
                            <Tooltip title='New folder'>
                              <IconButton size='small' onClick={e => setAddFolderPopup(e.currentTarget)}>
                                <AddRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        </Box>
                    }}
                  />
                )}
              />
            </FormControl>

          </Box>

          <Box my={2}>
            <FormControl fullWidth>
              <Autocomplete
                disabled={isLoading}
                options={membersAndAdmins}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.firstName} {option.lastName}</li>}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.role || ''}
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
                        </InputAdornment>,
                      endAdornment: params.InputProps.endAdornment
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Box my={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                disabled={isLoading}
                inputFormat="MM/DD/YYYY"
                value={dateDue}
                InputProps={{
                  style: {
                    flexDirection: 'row-reverse'
                  }
                }}
                onChange={value => setDateDue(value)}
                onAccept={value => setDateDue(value)}
                renderInput={(params) => <TextField
                  {...params}
                  fullWidth
                  helperText='Date due'
                />}
              ></DatePicker>
            </LocalizationProvider>
          </Box>
        </Box>
        <Divider />
        <Box my={4}>
          <Box component="h4" mb={2}>Tags</Box>
          <Box>
            <FormControl fullWidth>
              <Autocomplete
                disabled={isLoading}
                multiple
                value={selectedTags}
                options={tags}
                renderOption={(props, option) => <li {...props} key={option.id}>{option.name}</li>}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                filterSelectedOptions
                disableCloseOnSelect
                onKeyDown={handleCreateTag}
                onChange={(_, newTagsArray) => setSelectedTags(newTagsArray)}
                componentsProps={{
                  popper: {
                    placement: 'top'
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText='"&#x23CE;" to create new tags'
                    variant='standard'
                    placeholder={selectedTags.length === 0 ? 'Add tags' : ''}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: params.InputProps.endAdornment
                    }}
                  />
                )}
              />
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <Menu
        anchorEl={addFolderPopup}
        open={addFolderPopupOpen}
        onClose={() => setAddFolderPopup(null)}>
        <TextField
          disabled={addingFolder}
          onKeyDown={e => e.key === 'Enter' ? handleCreateFolder() : null}
          autoFocus
          size="small"
          placeholder="Folder name"
          style={{ margin: '0 10px' }}
          variant="standard"
          inputRef={newFolderName}
          inputProps={{
            style: {
              fontSize: '14px'
            }
          }}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                <Tooltip title="Save">
                  <span>
                    <IconButton
                      disabled={addingFolder}
                      size="small"
                      onClick={handleCreateFolder}>
                      {
                        addingFolder ?
                          <CircularProgress size={15} />
                          :
                          <CheckRoundedIcon
                            color="success"
                            fontSize="small" />
                      }
                    </IconButton>
                  </span>
                </Tooltip>
              </InputAdornment>
          }}
        />
      </Menu>
    </Drawer>
  );
};