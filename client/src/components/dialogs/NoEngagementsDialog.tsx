import { forwardRef, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Divider, Fade, Grow, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { deleteActiveEngagementId } from '../../api/engagements';
import CloseIcon from '@mui/icons-material/Close';
import Watermark from '../core/Watermark';
import { SwapHorizOutlined } from '@mui/icons-material';
import { setActiveOrgId } from '../../api/orgs';
import { Org } from '@shared/types/Org';
import { User } from '@shared/types/User';
import { TransitionProps } from '@mui/material/transitions';

const fixedTransition = forwardRef(function Transition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
},
  ref: React.Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={{ enter: 0 }} />;
});

type NoEngagementsDialogProps = {
  org: Org,
  isOpen: boolean,
  close?: () => void,
  user: User;
};

export default function NoEngagementsDialog(props: NoEngagementsDialogProps) {
  const {
    org,
    isOpen,
    close,
    user
  } = props;

  const [changeOrgMenuAnchor, setChangeOrgMenuAnchor] = useState<Element | null>(null);
  const [isLoadingOrg, setLoadingOrg] = useState(false);
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
        window.location.reload();
      }, 500);
    }
  }, [orgId]);

  const handleClose = () => {
    if (close) {
      close();
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
      TransitionComponent={fixedTransition}
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
            variant='contained'>
            Change org
          </Button>
          <Grow appear in timeout={{ enter: 500 }}>
            {pageIcon}
          </Grow>
          <Fade appear in timeout={{ enter: 300 }} style={{ transitionDelay: '125ms' }}>
            <Box>
              <Box component="h2" mb={1} mt={2}>
                No Engagements
              </Box>
              <Divider className='my3' />
              <Typography>
                The organization owner has not yet shared any engagements with you.
              </Typography>
              <Typography mt={1}>
                You may change organizations (top right menu) or return to the login page.
              </Typography>
              <Button
                style={{ marginTop: '1.5rem' }}
                variant='contained'
                onClick={() => window.location.href = '/login'}
                size='large'>
                Return to login
              </Button>
            </Box>
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
          user.orgs?.map(({ id, name }) => {
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