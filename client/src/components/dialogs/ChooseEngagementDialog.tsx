import DialogContent from '@mui/material/DialogContent';
import { ChangeEvent, KeyboardEvent, forwardRef, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Grow, IconButton, InputAdornment, Menu, MenuItem, Paper, TextField, Typography, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import './styles.scss';
import { SwapHorizOutlined } from "@mui/icons-material";
import { deleteActiveEngagementId, setActiveEngagementId } from '../../api/engagements';
import { setActiveOrgId } from '../../api/orgs';
import { Engagement } from '@shared/types/Engagement';
import { Org } from '@shared/types/Org';
import { User } from '@shared/types/User';
import { TransitionProps } from '@mui/material/transitions';

const toggleableTransition = forwardRef(function Transition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
},
  ref: React.Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={{ exit: 300, enter: 600 }} />;
});

const fixedTransition = forwardRef(function Transition(props: TransitionProps & {
  children: React.ReactElement<any, any>;
},
  ref: React.Ref<unknown>) {
  return <Grow ref={ref} {...props} timeout={{ enter: 0 }} />;
});

type ChooseEngagementDialogProps = {
  isOpen: boolean,
  closeDialog?: () => void,
  engagements: Engagement[],
  org: Org,
  user: User,
  engagement?: Engagement;
};

export default function ChooseEngagementDialog(props: ChooseEngagementDialogProps) {
  const {
    isOpen,
    closeDialog,
    engagements,
    org,
    user,
    engagement
  } = props;

  const [query, setQuery] = useState('');
  const [engagementId, setEngagementId] = useState<number>();
  const [orgId, setOrgId] = useState<number>();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isLoadingEngagement, setLoadingEngagement] = useState(false);
  const [isLoadingOrg, setLoadingOrg] = useState(false);
  const [changeOrgMenuAnchor, setChangeOrgMenuAnchor] = useState<Element | null>(null);

  const changeOrgMenuOpen = Boolean(changeOrgMenuAnchor);

  const handleClose = () => {
    if (closeDialog) {
      closeDialog();
    }

    setTimeout(() => {
      setQuery('');
      setShouldAnimate(true);
    }, 500);
  };

  useEffect(() => {
    if (isOpen) {
      setShouldAnimate(true);
      setTimeout(() => {
        setShouldAnimate(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && filteredEngagements.length === 1) {
      handleLoadEngagement(filteredEngagements[0].id);
    }
  };

  const handleLoadEngagement = (eId: number) => {
    setLoadingEngagement(true);
    setEngagementId(eId);
  };

  const handleLoadOrg = (orgId: number) => {
    setLoadingOrg(true);
    setOrgId(orgId);
  };

  useEffect(() => {
    if (isLoadingEngagement && engagementId) {
      setTimeout(() => {
        setActiveEngagementId(engagementId);
        window.location.href = '/home/dashboard';
      }, 500);
    } else if (isLoadingOrg && orgId) {
      setTimeout(() => {
        setActiveOrgId(orgId);
        deleteActiveEngagementId();
        window.location.href = '/home/dashboard';
      }, 500);
    }
  }, [engagementId, orgId]);

  const lcQuery = query.toLowerCase();
  const filteredEngagements = query ? engagements.filter(e => e.name.toLowerCase().includes(lcQuery)) : engagements;

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
    <Box>
      <Dialog
        className='choose-engagement-dialog'
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={closeDialog ? toggleableTransition : fixedTransition}
        PaperProps={{
          style: {
            padding: '1rem',
            overflowX: 'hidden'
          }
        }}
        fullScreen>
        <DialogContent className='content'>
          <Box className='my3'>
            <Box
              display="flex"
              position="relative"
              justifyContent="center"
              alignItems="flex-start">
              <IconButton
                className='close-btn'
                hidden={!closeDialog}
                size='large'
                onClick={handleClose}>
                <CloseIcon />
              </IconButton>
              <Box display="flex" flexDirection="column" alignItems="center">
                {pageIcon}
                <Box mt={2.5}>
                  <Box component="h2">Choose an Engagement</Box>
                </Box>
              </Box>
              <Button
                className='change-org-btn'
                startIcon={<SwapHorizOutlined />}
                onClick={e => setChangeOrgMenuAnchor(e.currentTarget)}
                variant='contained'>
                Change org
              </Button>
            </Box>
            <Box m='0 auto' width={300} mt={4} mb={3}>
              <TextField
                variant='standard'
                size='small'
                placeholder='Search'
                value={query}
                onKeyDown={handleSubmit}
                onChange={handleQueryChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                fullWidth>
              </TextField>
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              mt={3}
              maxWidth={1200}>
              {
                filteredEngagements.map((e, index) => {
                  return (
                    <Zoom key={e.id} appear={shouldAnimate} in style={{ transitionDelay: `${(index * 15) + 100}ms` }}>
                      <Paper
                        component={Button}
                        onClick={() => handleLoadEngagement(e.id)}
                        className={`choose-engagement-btn ${engagement?.id === e.id ? 'active' : ''}`}>
                        {
                          isLoadingEngagement && engagementId === e.id ?
                            <CircularProgress size={20} /> :
                            <Typography>{e.name}</Typography>
                        }
                      </Paper>
                    </Zoom>
                  );
                })
              }
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

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
    </Box>
  );
};