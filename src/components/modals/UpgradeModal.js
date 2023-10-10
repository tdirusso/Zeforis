import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { Box, DialogTitle, Divider, Typography } from '@mui/material';
import { closeAccount } from '../../api/users';
import { Link } from 'react-router-dom';

export default function UpgradeModal(props) {

  const {
    close,
    isOpen
  } = props;

  return (
    <div>
      <Dialog open={isOpen} onClose={close} className='modal' PaperProps={{ style: { minWidth: 425 } }}>
        <DialogTitle>
          Upgrade to Pro &nbsp;🚀
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography mb={1}>
            <Typography component='span' color='primary' fontWeight='bold'>Unlimited</Typography> engagements.
          </Typography>
          <Typography mb={1}>
            <Typography component='span' color='primary' fontWeight='bold'>Unlimited</Typography> tasks.
          </Typography>
          <Typography>
            <Typography component='span' color='primary' fontWeight='bold'>Additional</Typography> administrators.
          </Typography>
          <Box mt={4}>
            <Link to='settings/account/billing' onClick={close}>
              <Button size='large' variant='contained' fullWidth>
                Upgrade now
              </Button>
            </Link>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};