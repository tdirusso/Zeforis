import { forwardRef, useRef, useState } from 'react';
import { Box, Dialog, Divider, Fade, Grow, IconButton, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { createEngagement, setActiveEngagementId } from '../../api/engagements';
import zeforisLogo from '../../assets/zeforis-logo.png';
import CloseIcon from '@mui/icons-material/Close';

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
    close
  } = props;

  const name = useRef();
  const [isLoading, setLoading] = useState(false);

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
        const fd = new FormData();
        fd.append('name', nameVal);
        fd.append('orgId', org.id);

        const { engagement, message } = await createEngagement(fd);

        if (engagement) {
          setActiveEngagementId(engagement.id);
          openSnackBar('Engagement created.', 'success');
          setTimeout(() => {
            window.location.href = close ? '/home/folders' : '/home/folders?gettingStarted=true';
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
      <Box className="flex-centered" sx={{ height: '100%' }}>
        <Box textAlign="center" mb={'100px'} maxWidth={600}>
          <IconButton
            hidden={!close}
            size='large'
            onClick={handleClose}
            sx={{
              position: 'absolute',
              left: '100px',
              top: '30px'
            }}>
            <CloseIcon />
          </IconButton>
          <Grow appear in timeout={{ enter: 500 }}>
            {pageIcon}
          </Grow>
          <Fade appear in timeout={{ enter: 300 }} style={{ transitionDelay: '125ms' }}>
            <Box>
              <Box component="h2" mb={1} mt={2}>
                Create an Engagement
              </Box>
              <Divider sx={{ my: 3 }} />
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
                size='large'
                type='submit'
                loading={isLoading}>
                Create Engagement
              </LoadingButton>
            </form>
          </Fade>
          <Grow appear in>
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                color: '#5f5f5f !important',
                display: 'flex',
                alignItems: 'center'
              }}
              component="a"
              href="https://www.zeforis.com"
              target="_blank">
              Powered by  <img src={zeforisLogo} alt="Zeforis" height={15} style={{ marginLeft: '4px' }} />
            </Box>
          </Grow>
        </Box>
      </Box>
    </Dialog>
  );
};