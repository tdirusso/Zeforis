import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useEffect, useRef, useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { TextField, Checkbox, FormControlLabel, Grid, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { updateFolder } from '../../api/folder';
import { useOutletContext } from 'react-router-dom';

export default function EditFolderModal(props) {
  const {
    open,
    setOpen,
    folder,
  } = props;

  const name = useRef();
  const [isLoading, setLoading] = useState(false);
  const [isKeyFolder, setIsKeyFolder] = useState(Boolean(folder?.is_key_folder));

  const {
    client,
    setFolders,
    foldersMap,
    openSnackBar
  } = useOutletContext();

  useEffect(() => {
    setIsKeyFolder(Boolean(folder?.is_key_folder));
  }, [folder]);

  const clientId = client.id;


  const handleUpdateFolder = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the folder.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { updatedFolder, message } = await updateFolder({
        name: nameVal,
        clientId,
        isKeyFolder,
        folderId: folder.id
      });

      if (updatedFolder) {
        setTimeout(() => {
          setLoading(false);
          openSnackBar('Folder successfully updated.', 'success');
        }, 300);

        const theFolder = foldersMap[folder.id];
        foldersMap[folder.id] = { ...theFolder, ...updatedFolder };

        setFolders(Object.values(foldersMap));
        setOpen(false);
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
    setTimeout(() => {
      setIsKeyFolder(Boolean(folder.is_key_folder));
      setLoading(false);
    }, 500);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText mb={2}>
            You can edit the folder details below.
          </DialogContentText>
          <Grid container rowSpacing={2} columnSpacing={1} >
            <Grid item xs={12}>
              <TextField
                fullWidth
                autoFocus
                disabled={isLoading}
                inputRef={name}
                required
                defaultValue={folder?.name}
                label='Name'
              />
            </Grid>
            <Grid item xs={12} mt="-20px">
              <FormControlLabel
                componentsProps={{ typography: { fontWeight: '300' } }}
                sx={{ mt: 2, fontSize: '12px' }}
                control={<Checkbox
                  onChange={(_, val) => setIsKeyFolder(val)}
                  value={isKeyFolder}
                  checked={isKeyFolder}
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
              onClick={handleUpdateFolder}
              fullWidth
              loading={isLoading}>
              Update Folder
            </LoadingButton>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};