import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useRef, useState } from 'react';
import { Box, Checkbox, Drawer, FormControlLabel, Grid, IconButton, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createFolder } from '../../api/folders';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

export default function CreateFolderDrawer(props) {
  const {
    isOpen,
    close,
    client,
    openSnackBar,
    setFolders
  } = props;

  const clientId = client.id;

  const name = useRef();

  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(false);

  useEffect(() => {
    if (isOpen) {
      name.current.focus();
    }
  }, [isOpen]);

  const handleCreateFolder = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new folder.');
      return;
    }

    setLoading(true);
    try {
      const { folder, message } = await createFolder({
        name: nameVal,
        clientId,
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

  const handleClose = () => {
    close();
    setTimeout(() => {
      name.current.value = '';
      setIsKeyFolder(false);
      setLoading(false);
    }, 500);
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
                    Create New Folder
                  </DialogTitle>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoFocus
                  disabled={isLoading}
                  inputRef={name}
                  placeholder='Folder name'
                  required>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  componentsProps={{ typography: { fontWeight: '300' } }}
                  sx={{ mt: 1.5 }}
                  control={<Checkbox
                    icon={<StarBorderIcon />}
                    checkedIcon={<StarIcon />}
                    checked={isKeyFolder}
                    onChange={(_, val) => setIsKeyFolder(val)}
                    disabled={isLoading}
                  />}
                  label="Key folder"
                />
              </Grid>
            </Grid>
          </Box>

          <LoadingButton
            sx={{ mt: '10px' }}
            variant='contained'
            onClick={handleCreateFolder}
            type='submit'
            fullWidth
            size='large'
            loading={isLoading}>
            Create Folder
          </LoadingButton>
        </DialogContent>
      </Drawer>
    </div>
  );
};