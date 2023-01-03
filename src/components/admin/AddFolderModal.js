import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Box, TextField, Checkbox, FormControlLabel, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { addFolder } from '../../api/folder';
import { useOutletContext } from 'react-router-dom';

export default function AddFolderModal(props) {
  const {
    open,
    setOpen,
    willBeKey
  } = props;

  const name = useRef();
  const description = useRef();
  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(Boolean(willBeKey));

  const {
    client, setFolders
  } = useOutletContext();

  const clientId = client.id;

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateFolder = e => {
    e.preventDefault();

    const nameVal = name.current.value;
    const descriptionVal = description.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new folder.', 'error');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { folder, message } = await addFolder({
          name: nameVal,
          description: descriptionVal,
          clientId,
          isKeyFolder
        });

        if (folder) {
          setTimeout(() => {
            openSnackBar('Folder created.', 'success');
          }, 300);

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
    }, 1000);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Create New Folder
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the new folder's name and description (optional) below.
          </DialogContentText>
          <form onSubmit={handleCreateFolder}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <TextField
                fullWidth
                autoFocus
                disabled={isLoading}
                inputRef={name}
                required
                label='Name'
              >
              </TextField>
              <TextField
                fullWidth
                disabled={isLoading}
                inputRef={description}
                label="Description"
                sx={{ mt: 2 }}
              >
              </TextField>
              <FormControlLabel
                componentsProps={{ typography: { fontWeight: '300' } }}
                sx={{ mt: 2, fontSize: '12px' }}
                control={<Checkbox
                  onChange={(_, val) => setIsKeyFolder(val)}
                  defaultChecked={willBeKey}
                />}
                label="Is this a Key Folder?"
              />
            </Box>
            <DialogActions>
              <Button
                disabled={isLoading}
                onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                variant='contained'
                onClick={handleCreateFolder}
                type='submit'
                loading={isLoading}>
                Create Folder
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