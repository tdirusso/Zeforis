import { FormEvent, forwardRef, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Divider, Fade, Grow, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createEngagement, deleteActiveEngagementId, setActiveEngagementId } from '../../api/engagements';
import CloseIcon from '@mui/icons-material/Close';
import Watermark from '../core/Watermark';
import { SwapHorizOutlined } from '@mui/icons-material';
import { setActiveOrgId } from '../../api/orgs';
import { isMobile } from '../../lib/constants';
import { Org } from '@shared/types/Org';
import { User } from '@shared/types/User';
import { AppContext } from 'src/types/AppContext';
import { TransitionProps } from '@mui/material/transitions';

const toggleableTransition = forwardRef(function Transition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
},
  ref: React.Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={{ exit: 300, enter: 300 }} />;
});

const fixedTransition = forwardRef(function Transition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
},
  ref: React.Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={{ enter: 0 }} />;
});

type CreateEngagementDialogProps = {
  isOpen: boolean,
  closeDialog?: () => void,
  org: Org,
  user: User,
  openSnackBar: AppContext['openSnackBar'];
};

export default function CreateEngagementDialog(props: CreateEngagementDialogProps) {
  const {
    org,
    openSnackBar,
    isOpen,
    closeDialog,
    user
  } = props;

  const name = useRef<HTMLInputElement>(null);

  const [changeOrgMenuAnchor, setChangeOrgMenuAnchor] = useState<Element | null>(null);
  const [isLoadingOrg, setLoadingOrg] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState<number>();

  const changeOrgMenuOpen = Boolean(changeOrgMenuAnchor);

  const handleLoadOrg = (orgId: number) => {
    setLoadingOrg(true);
    setOrgId(orgId);
  };

  useEffect(() => {
    if (isLoadingOrg && orgId) {
      setTimeout(() => {
        setActiveOrgId(orgId);
        deleteActiveEngagementId();
        window.location.replace('/home/dashboard');
      }, 500);
    }
  }, [orgId]);

  const handleCreateEngagement = (e: FormEvent) => {
    e.preventDefault();

    const nameVal = name.current?.value;

    if (!nameVal) {
      openSnackBar('Please enter a name for the engagement.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      try {
        const { engagement, message } = await createEngagement({
          name: nameVal,
          orgId: org.id
        });

        if (engagement) {
          setActiveEngagementId(engagement.id);
          openSnackBar('Engagement created.', 'success');

          if (!closeDialog) {
            localStorage.setItem('openGettingStarted', 'true');
          }

          setTimeout(() => {
            window.location.href = '/home/dashboard';
          }, 500);
        } else {
          openSnackBar(message, 'error');
          setLoading(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          openSnackBar(error.message, 'error');
          setLoading(false);
        }
      }
    }, 1500);
  };

  const handleClose = () => {
    if (closeDialog) {
      closeDialog();
    }
  };

  let pageIcon = <Box
    component="h1"
    style={{ color: org.brandColor }}>
    {org.name}
  </Box>;

  if (org.logo) {
    pageIcon = <Box>
      <img src={org.logo} alt="" height={40} />
    </Box>;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={closeDialog ? toggleableTransition : fixedTransition}
      fullScreen>
      <Fade appear in timeout={{ enter: 400 }}>
        <Box className="flex-centered" style={{ height: '100%' }}>
          <Box textAlign="center" mb={'100px'} maxWidth={600}>
            <IconButton
              hidden={!closeDialog}
              size='large'
              onClick={handleClose}
              style={{
                position: 'absolute',
                left: '100px',
                top: '30px'
              }}>
              <CloseIcon />
            </IconButton>
            <Button
              startIcon={<SwapHorizOutlined />}
              onClick={e => setChangeOrgMenuAnchor(e.currentTarget)}
              style={{ position: 'absolute', right: '100px', top: '30px' }}
              variant='contained'>
              Change org
            </Button>
            {pageIcon}
            <Box>
              <Box component="h2" mb={1} mt={2}>
                Create an Engagement
              </Box>
              <Divider className='my3' />
              <Typography>
                An engagement is a project with one of your customers/clients.
              </Typography>
              <Typography mt={1}>
                The engagement name should be the company name for the customer you're engaging with, or just a simple project name.
              </Typography>
            </Box>
            <form onSubmit={handleCreateEngagement}>
              <Box className='my3'>
                <TextField
                  placeholder="Engagement Name"
                  fullWidth
                  autoFocus={!isMobile}
                  disabled={isLoading}
                  inputRef={name}>
                </TextField>
              </Box>
              <LoadingButton
                variant='contained'
                fullWidth
                size='large'
                type='submit'
                loading={isLoading}>
                Create Engagement
              </LoadingButton>
            </form>
            <Box>
              <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
            </Box>
          </Box>
        </Box>
      </Fade>

      <Menu
        PaperProps={{ style: { minWidth: 200 } }}
        anchorEl={changeOrgMenuAnchor}
        open={changeOrgMenuOpen}
        onClose={() => setChangeOrgMenuAnchor(null)}>
        {
          user.memberOfOrgs?.map(({ id, name }) => {
            return (
              <MenuItem
                disabled={id === org.id}
                selected={id === org.id}
                key={id}
                onClick={() => handleLoadOrg(id)}>
                {
                  isLoadingOrg && orgId === id ? <CircularProgress size={20} /> : name
                }
              </MenuItem>
            );
          })
        }
      </Menu>
    </Dialog>
  );
};