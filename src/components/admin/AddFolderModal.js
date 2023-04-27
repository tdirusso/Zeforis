import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { TextField, Checkbox, FormControlLabel, Grid, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addFolder } from '../../api/folder';
import { useOutletContext } from 'react-router-dom';

export default function AddFolderModal(props) {
  const {
    open,
    setOpen,
    willBeKey
  } = props;

  const name = useRef();
  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(Boolean(willBeKey));

  const {
    client, 
    setFolders,
    openSnackBar
  } = useOutletContext();

  const clientId = client.id;

  const handleCreateFolder = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new folder.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { folder, message } = await addFolder({
        name: nameVal,
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
          <DialogContentText mb={2}>
            Please enter the new folder's name below.
          </DialogContentText>
          <Grid container rowSpacing={2} columnSpacing={1} >
            <Grid item xs={12}>
              <TextField
                fullWidth
                autoFocus
                disabled={isLoading}
                inputRef={name}
                required
                label='Name'
              />
            </Grid>
            <Grid item xs={12} mt="-20px">
              <FormControlLabel
                componentsProps={{ typography: { fontWeight: '300' } }}
                sx={{ mt: 2, fontSize: '12px' }}
                control={<Checkbox
                  onChange={(_, val) => setIsKeyFolder(val)}
                  defaultChecked={willBeKey}
                  disabled={isLoading}
                />}
                label="Is this a Key Folder?"
              />
            </Grid>
          </Grid>
          <DialogActions sx={{ p: 0, mt: 2 }}>
            <Button
              disabled={isLoading}
              fullWidth
              variant='outlined'
              onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton
              variant='contained'
              onClick={handleCreateFolder}
              fullWidth
              loading={isLoading}>
              Create Folder
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};