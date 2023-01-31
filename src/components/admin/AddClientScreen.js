import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { addClient, setActiveClientId } from '../../api/client';

export default function AddClientScreen({ account }) {
  const name = useRef();
  const logo = useRef();
  const [logoSrc, setLogoSrc] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateClient = async () => {
    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new client.', 'error');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('logoFile', logoFile);
      fd.append('name', nameVal);
      fd.append('accountId', account.id);

      const { client, message } = await addClient(fd);

      if (client) {
        setActiveClientId(client.id);
        openSnackBar('Client created.', 'success');
        setTimeout(() => {
          window.location.href = '/home/dashboard';
        }, 500);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  const handleLogoChange = e => {
    console.log(e);
    const imageFile = e.target.files[0];

    if (!imageFile) {
      return;
    };

    setLogoSrc(URL.createObjectURL(imageFile));
    setLogoFile(imageFile);
  };

  const handleLogoClear = () => {
    setLogoSrc('');
    setLogoFile(null);
    logo.current.value = '';
  };

  console.log(logoFile);

  return (
    <Paper sx={{ p: 5 }}>
      <Box component="h3" mb={1}>
        Create a New Client
      </Box>
      <Typography>
        Please enter the client's name and logo image (optional) below.
      </Typography>
      <Box sx={{ mt: 3, mb: 3 }}>
        <TextField
          label="Client Name"
          fullWidth
          autoFocus
          disabled={isLoading}
          inputRef={name}>
        </TextField>
      </Box>
      <Box sx={{ mt: 5, mb: 5, display: 'flex', alignItems: 'center' }}>
        <Button
          variant='outlined'
          component='label'
          sx={{ mr: 1 }}
          disabled={isLoading}>
          Upload Logo
          <input
            hidden
            ref={logo}
            accept="image/png,image/jpeg"
            type="file"
            onChange={handleLogoChange}
            disabled={isLoading}
          />
        </Button>
        <Button
          sx={{
            display: logoSrc ? 'block' : 'none',
            mr: 4
          }}
          onClick={handleLogoClear}
          disabled={isLoading}>
          Clear
        </Button>
        <img
          src={logoSrc}
          alt=""
          width={125} />
      </Box>
      <LoadingButton
        variant='contained'
        fullWidth
        onClick={handleCreateClient}
        loading={isLoading}>
        Create Client
      </LoadingButton>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Paper>
  );
};