import { useRef, useState } from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Snackbar from '../core/Snackbar';
import useSnackbar from '../../hooks/useSnackbar';
import { createEngagement, setActiveEngagementId } from '../../api/engagements';

export default function CreateEngagementScreen({ org }) {
  const name = useRef();
  const [isLoading, setLoading] = useState(false);

  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleCreateEngagement = async e => {
    e.preventDefault();

    const nameVal = name.current.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the new engagement.', 'error');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', nameVal);
      fd.append('orgId', org.id);

      const { engagement, message } = await createEngagement(fd);

      if (engagement) {
        setActiveEngagementId(engagement.id);
        openSnackBar('Engagement created.', 'success');
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

  return (
    <Paper sx={{ p: 5, width: 600 }}>
      <Box component="h3" mb={1}>
        Create a New Engagement
      </Box>
      <Typography>
        Please enter the engagement's name below.
      </Typography>
      <form onSubmit={handleCreateEngagement}>
        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            placeholder="Engagement Name"
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
          Create Engagement
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