import { useRef, useState } from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { addAccount, setActiveAccountId } from '../../api/account';

export default function AddAccountScreen({ user }) {
  const name = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateAccount = async e => {
    e.preventDefault();

    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name your organization.', 'error');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', nameVal);
      fd.append('userId', user.id);

      const { accountId, message } = await addAccount(fd);

      if (accountId) {
        setActiveAccountId(accountId);
        openSnackBar('Organization created successfully.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 5, width: 600 }}>
      <Box component="h3" mb={1}>
        Create a New Organization
      </Box>
      <Typography>
        You are not a member of any organizations - please create your own organization by entering it's name below.
      </Typography>
      <form onSubmit={handleCreateAccount}>
        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            placeholder="Organization Name"
            fullWidth
            autoFocus
            disabled={isLoading}
            inputRef={name}>
          </TextField>
        </Box>
        <LoadingButton
          variant='contained'
          fullWidth
          type='submit'
          loading={isLoading}>
          Create Organization
        </LoadingButton>
      </form>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </Paper>
  );
};