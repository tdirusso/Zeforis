/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Divider, Fade, Grow, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createEngagement, deleteActiveEngagementId, setActiveEngagementId } from '../../api/engagements';
import CloseIcon from '@mui/icons-material/Close';
import Watermark from '../core/Watermark';
import { SwapHorizOutlined } from '@mui/icons-material';
import { setActiveOrgId } from '../../api/orgs';
import { isMobile } from '../../lib/constants';

const toggleableTransition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={{ exit: 300, enter: 300 }} />;
});

const fixedTransition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={{ enter: 0 }} />;
});

export default function CreateEngagementDialog(props) {
  const {
    org,
    openSnackBar,
    isOpen,
    close,
    user
  } = props;

  const name = useRef();

  const [changeOrgMenuAnchor, setChangeOrgMenuAnchor] = useState(null);
  const [isLoadingOrg, setLoadingOrg] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState();

  const changeOrgMenuOpen = Boolean(changeOrgMenuAnchor);

  const handleLoadOrg = orgId => {
    setLoadingOrg(true);
    setOrgId(orgId);
  };

  useEffect(() => {
    if (isLoadingOrg) {
      setTimeout(() => {
        setActiveOrgId(orgId);
        deleteActiveEngagementId();
        window.location.reload();
      }, 500);
    }
  }, [orgId]);

  const handleCreateEngagement = e => {
    e.preventDefault();

    const nameVal = name.current.value;

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

          if (!close) {
            localStorage.setItem('openGettingStarted', 'true');
          }
          
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
    }, 1500);
  };

  const handleClose = () => {
    close();
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
      TransitionComponent={close ? toggleableTransition : fixedTransition}
      fullScreen>
      <Box className="flex-centered" style={{ height: '100%' }}>
        <Box textAlign="center" mb={'100px'} maxWidth={600}>
          <IconButton
            hidden={!close}
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
            variant='outlined'>
            Change org
          </Button>
          <Grow appear in timeout={{ enter: 500 }}>
            {pageIcon}
          </Grow>
          <Fade appear in timeout={{ enter: 300 }} style={{ transitionDelay: '125ms' }}>
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
          </Fade>
          <Fade appear in timeout={{ enter: 300 }} style={{ transitionDelay: '200ms' }}>
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
          </Fade>
          <Grow appear in>
            <Box>
              <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }} />
            </Box>
          </Grow>
        </Box>
      </Box>

      <Menu
        PaperProps={{ style: { minWidth: 200 } }}
        anchorEl={changeOrgMenuAnchor}
        open={changeOrgMenuOpen}
        onClose={() => setChangeOrgMenuAnchor(null)}>
        {
          user.memberOfOrgs.map(({ id, name }) => {
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