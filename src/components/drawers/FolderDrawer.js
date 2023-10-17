/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Checkbox, Drawer, FormControlLabel, FormHelperText, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createFolder, updateFolder } from '../../api/folders';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import HelpIcon from '@mui/icons-material/Help';
import { isMobile } from '../../lib/constants';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';

export default function FolderDrawer(props) {
  const {
    isOpen,
    close,
    engagement,
    openSnackBar,
    setFolders,
    folderProps,
    foldersMap,
    openModal
  } = props;

  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  const nameRef = useRef();

  const getPath = (folderId) => {
    const pathArray = [];

    const findParentFolder = (folderId) => {
      const parentFolder = foldersMap[folderId];
      if (parentFolder) {
        pathArray.unshift(parentFolder.name);
        findParentFolder(parentFolder.parent_id);
      }
    };

    findParentFolder(folderId);
    return pathArray.join(' / ');
  };

  useEffect(() => {
    if (isOpen) {
      if (!isMobile) {
        nameRef.current.focus();
      }

      if (folderProps) {
        if (folderProps.id) {
          const theFolder = foldersMap[folderProps.id];
          if (theFolder.parent_id) {
            setPath(getPath(theFolder.parent_id));
          }
          setName(theFolder.name);
          setIsKeyFolder(Boolean(theFolder.is_key_folder));
        } else {
          setName('');
          setIsKeyFolder(Boolean(folderProps.is_key_folder));
        }
      }
    }
  }, [isOpen, folderProps]);

  const handleMoveClick = () => {
    openModal('move-folder', { moveFolderId: folderProps.id });
    handleClose();
  };

  const handleCreateFolder = async e => {
    e.preventDefault();

    if (!name) {
      openSnackBar('Please enter a name for the new folder.');
      return;
    }

    setLoading(true);

    try {
      const { folder, message } = await createFolder({
        name,
        engagementId: engagement.id,
        isKeyFolder
      });

      if (folder) {
        openSnackBar('Folder created.', 'success');
        setFolders(folders => [...folders, folder]);
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

  const handleUpdateFolder = async e => {
    e.preventDefault();

    if (!name) {
      openSnackBar('Enter a name for the folder.');
      return;
    }

    const theFolder = foldersMap[folderProps.id];

    setLoading(true);

    try {
      const { updatedFolder, message } = await updateFolder({
        name,
        engagementId: engagement.id,
        isKeyFolder,
        folderId: folderProps.id,
        parentId: theFolder.parent_id
      });

      if (updatedFolder) {
        foldersMap[folderProps.id] = { ...theFolder, ...updatedFolder };
        setFolders(Object.values(foldersMap));
        setLoading(false);
        openSnackBar('Folder updated.', 'success');
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
      setName('');
      setPath('');
      setIsKeyFolder(false);
      setLoading(false);
    }, 500);
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
          <Grid container rowSpacing={0} columnSpacing={1.5}>
            <Grid item xs={12} mb={2}>
              <Box
                mb={4}
                display="flex"
                position="relative"
                alignItems="center"
                justifyContent="center">
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
                  {folderProps?.id ? 'Edit Folder' : 'Create New Folder'}
                </DialogTitle>
              </Box>
            </Grid>
            <Box component='form' width="100%" onSubmit={folderProps?.id ? handleUpdateFolder : handleCreateFolder}>
              <Grid item xs={12}>
                <TextField
                  inputRef={nameRef}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start'>
                        <FolderIcon />
                      </InputAdornment>
                  }}
                  fullWidth
                  autoFocus={!isMobile}
                  disabled={isLoading}
                  placeholder='Folder name'>
                </TextField>
                <FormHelperText
                  hidden={!folderProps?.id}
                  component={Box}
                  className='flex-ac'
                  justifyContent='space-between'>
                  <span hidden={!path}>
                    {`${path} → ${name}`}
                  </span>
                  <Button
                    size='small'
                    onClick={handleMoveClick}
                    startIcon={<ShortcutRoundedIcon fontSize='small' />}>
                    Move
                  </Button>
                </FormHelperText>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  componentsProps={{ typography: { fontWeight: '300' } }}
                  style={{ marginTop: '0.75rem' }}
                  control={<Checkbox
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon htmlColor='gold' />}
                    checked={isKeyFolder}
                    onChange={(_, val) => setIsKeyFolder(val)}
                    disabled={isLoading}
                  />}
                  label="Key folder"
                />
                <Tooltip title='Key folders are displayed on the Dashboard.' placement="top">
                  <HelpIcon
                    fontSize="small"
                    style={{
                      position: 'relative',
                      top: '11px',
                      right: '10px'
                    }}
                    htmlColor="#c7c7c7"
                  />
                </Tooltip>
              </Grid>
              <LoadingButton
                style={{ marginTop: '1rem' }}
                variant='contained'
                type='submit'
                fullWidth
                size='large'
                loading={isLoading}>
                {folderProps?.id ? 'Update folder' : 'Create folder'}
              </LoadingButton>
            </Box>
          </Grid>
        </Box>
      </DialogContent>
    </Drawer>
  );
};