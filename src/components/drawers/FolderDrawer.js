import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Drawer, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createFolder, updateFolder } from '../../api/folders';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import HelpIcon from '@mui/icons-material/Help';
import { isMobile } from '../../lib/constants';

export default function FolderDrawer(props) {
  const {
    isOpen,
    close,
    engagement,
    openSnackBar,
    setFolders,
    folderProp,
    foldersMap
  } = props;

  const name = useRef();

  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!isMobile) {
        name.current.focus();
      }

      if (folderProp) {
        name.current.value = folderProp.name || '';
        setIsKeyFolder(Boolean(folderProp.is_key_folder));
      }
    }
  }, [isOpen, folderProp]);

  const handleCreateFolder = async e => {
    e.preventDefault();

    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new folder.');
      return;
    }

    setLoading(true);
    try {
      const { folder, message } = await createFolder({
        name: nameVal,
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

    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Enter a name for the folder.');
      return;
    }

    setLoading(true);

    try {
      const { updatedFolder, message } = await updateFolder({
        name: nameVal,
        engagementId: engagement.id,
        isKeyFolder,
        folderId: folderProp.id
      });

      if (updatedFolder) {
        setLoading(false);
        const theFolder = foldersMap[folderProp.id];
        foldersMap[folderProp.id] = { ...theFolder, ...updatedFolder };
        setFolders(Object.values(foldersMap));
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
      name.current.value = '';
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
                  {folderProp?.id ? 'Edit Folder' : 'Create New Folder'}
                </DialogTitle>
              </Box>
            </Grid>
            <Box component='form' width="100%" onSubmit={folderProp?.id ? handleUpdateFolder : handleCreateFolder}>
              <Grid item xs={12}>
                <TextField
                  InputProps={{
                    startAdornment:
                      <InputAdornment position='start'>
                        <FolderIcon />
                      </InputAdornment>
                  }}
                  fullWidth
                  autoFocus={!isMobile}
                  disabled={isLoading}
                  inputRef={name}
                  placeholder='Folder name'>
                </TextField>
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
                {folderProp?.id ? 'Update folder' : 'Create folder'}
              </LoadingButton>
            </Box>
          </Grid>
        </Box>
      </DialogContent>
    </Drawer>
  );
};