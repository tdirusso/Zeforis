import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { Box, Collapse, DialogTitle, Divider, FormControlLabel, Switch, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { AppContext } from 'src/types/AppContext';
import { Engagement } from '@shared/types/Engagement';
import { updateEngagement } from 'src/api/engagements';
import { getErrorObject } from 'src/lib/utils';
import { TransitionGroup } from 'react-transition-group';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

type InviteLinkModalProps = {
  closeModal: () => void,
  isOpen: boolean,
  openSnackBar: AppContext['openSnackBar'];
  engagement: Engagement;
  setEngagement: AppContext['setEngagement'];
};

function isValidDomain(domain: string) {
  const domainPattern = /^(?!-)(?:[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.){1,126}(?:[a-zA-Z]{2,63})$/;
  return domainPattern.test(domain);
}

export default function InviteLinkModal(props: InviteLinkModalProps) {

  const {
    closeModal,
    isOpen,
    openSnackBar,
    engagement,
    setEngagement
  } = props;

  const theme = useTheme();

  const [isSavingAllowedDomains, setSavingAllowedDomains] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [allowedInviteDomains, setAllowedInviteDomains] = useState(engagement.allowedInviteDomains || '');

  const inviteLink = `${process.env.REACT_APP_APP_DOMAIN}/invite/${engagement.inviteLinkHash}`;

  const allowedDomains = allowedInviteDomains.split(',') || [];

  const validDomains = allowedDomains
    .map(domain => domain.trim())
    .filter(domain => isValidDomain(domain));

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

  const handleUpdateAllowedInviteDomains = async () => {
    setSavingAllowedDomains(true);

    try {
      const updatedEngagement = await updateEngagement(engagement.id, {
        allowedInviteDomains
      });

      setEngagement({ ...engagement, ...updatedEngagement });
      setSavingAllowedDomains(false);
      openSnackBar('Allowed domains upated.', 'success');
    } catch (error: unknown) {
      setSavingAllowedDomains(false);
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
      <DialogTitle className='flex-sb'>
        Invite Users to {engagement.name}
        <IconButton
          aria-label="close"
          onClick={closeModal}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ minWidth: '450px' }}>
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
                  <Box mt={3}>
                    <Typography mb={1} className='flex-ac' gap='4px'>
                      Allowed email domain(s)
                      <Tooltip title="Enter a list email domains, comma separated.  Only these domains are allowed using the invite link.  No entries will allow all domains.">
                        <HelpIcon
                          fontSize='small'
                          htmlColor='lightgrey'
                        />
                      </Tooltip>

                    </Typography>
                    <TextField
                      onChange={e => setAllowedInviteDomains(e.target.value)}
                      value={allowedInviteDomains}
                      size='small'
                      fullWidth
                      placeholder='domain1.com, domain2.com'
                      variant="outlined"
                      multiline
                      inputProps={{
                        style: {
                          resize: 'vertical'
                        }
                      }}
                    />
                    <Box className='flex-sb'>
                      <Typography variant='caption' style={{ color: theme.palette.grey[500] }}>
                        {`Allowing:  ${validDomains.length ? validDomains.map(domain => '@' + domain).join(', ') : 'All domains'}`}
                      </Typography>
                      <Box mt={.5}>
                        <LoadingButton
                          loading={isSavingAllowedDomains}
                          onClick={handleUpdateAllowedInviteDomains}
                          size='small'>
                          Save
                        </LoadingButton>
                      </Box>
                    </Box>

                  </Box>
                </Box>
              </Collapse> : null
          }
        </TransitionGroup>
      </DialogContent>
    </Dialog>
  );
};