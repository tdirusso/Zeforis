import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { Box, Checkbox, Collapse, DialogTitle, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { AppContext } from 'src/types/AppContext';
import { Engagement } from '@shared/types/Engagement';
import { updateEngagement } from 'src/api/engagements';
import { getErrorObject } from 'src/lib/utils';
import { TransitionGroup } from 'react-transition-group';

type InviteLinkModalProps = {
  closeModal: () => void,
  isOpen: boolean,
  openSnackBar: AppContext['openSnackBar'];
  engagement: Engagement;
  setEngagement: AppContext['setEngagement'];
};

export default function InviteLinkModal(props: InviteLinkModalProps) {

  const {
    closeModal,
    isOpen,
    openSnackBar,
    engagement,
    setEngagement
  } = props;

  //const []
  const [isLoading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const inviteLink = `${process.env.REACT_APP_APP_DOMAIN}/invite/${engagement.inviteLinkHash}`;

  const handleToggleInviteLink = async (_: React.ChangeEvent<HTMLInputElement>, isEnabled: boolean) => {
    try {
      const updatedEngagement = await updateEngagement(engagement.id, {
        isInviteLinkEnabled: isEnabled
      });

      setEngagement({ ...engagement, ...updatedEngagement });
    } catch (error: unknown) {
      openSnackBar(getErrorObject(error).message, 'error');
    }
  };

  const handleCopyInviteLink = () => {
    window.navigator.clipboard.writeText(inviteLink);
    setCopyButtonText('Copied!');
    setTimeout(() => {
      setCopyButtonText('Copy');
    }, 750);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className='modal'>
      <DialogTitle>
        Invite Users to {engagement.name}
      </DialogTitle>
      <DialogContent style={{ width: '450px' }}>
        <Box>
          <Typography mb={2}>
            Allow users to add themselves to this engagement.
          </Typography>
          <FormControlLabel
            className="mx0"
            control={<Switch
              checked={Boolean(engagement.isInviteLinkEnabled)}
              onChange={handleToggleInviteLink} />}
            label={engagement.isInviteLinkEnabled ? 'Enabled' : 'Disabled'}
          />
        </Box>

        <TransitionGroup>
          {
            Boolean(engagement.isInviteLinkEnabled) ?
              <Collapse>
                <Box>
                  <Divider className='my2' />
                  <Typography mb={1}>
                    Copy this link and send it to anyone to join.
                  </Typography>
                  <TextField
                    InputProps={{
                      endAdornment:
                        <Button
                          onClick={handleCopyInviteLink}
                          variant='contained'
                          size='small'>
                          {copyButtonText}
                        </Button>
                    }}
                    inputProps={{
                      readOnly: true
                    }}
                    size='small'
                    value={inviteLink}
                    fullWidth>
                  </TextField>
                </Box>
              </Collapse> : null
          }

        </TransitionGroup>

        <Box mt={3}>
          <Button
            size='small'
            variant='outlined'
            onClick={closeModal}>
            Close
          </Button>
        </Box>

      </DialogContent>
    </Dialog>
  );
};