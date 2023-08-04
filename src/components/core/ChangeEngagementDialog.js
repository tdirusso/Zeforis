/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { forwardRef, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Grow, IconButton, InputAdornment, Menu, MenuItem, Paper, TextField, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import './styles/ChangeEngagementDialog.css';
import { SwapHorizOutlined } from "@mui/icons-material";
import { deleteActiveEngagementId, setActiveEngagementId } from '../../api/engagements';
import { setActiveOrgId } from '../../api/orgs';

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={{ exit: 300, enter: 600 }} />;
});

export default function ChangeEngagementDialog(props) {
  const {
    isOpen,
    close,
    engagements,
    org,
    user
  } = props;

  const [query, setQuery] = useState('');
  const [engagementId, setEngagementId] = useState();
  const [orgId, setOrgId] = useState();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isLoadingEngagement, setLoadingEngagement] = useState(false);
  const [isLoadingOrg, setLoadingOrg] = useState(false);
  const [changeOrgMenuAnchor, setChangeOrgMenuAnchor] = useState(null);

  const changeOrgMenuOpen = Boolean(changeOrgMenuAnchor);

  const handleClose = () => {
    close();
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

  const handleQueryChange = e => {
    setQuery(e.target.value);
  };

  const handleSubmit = e => {
    if (e.key === 'Enter' && filteredEngagements.length === 1) {
      handleLoadEngagement(filteredEngagements[0].id);
    }
  };

  const handleLoadEngagement = eId => {
    setLoadingEngagement(true);
    setEngagementId(eId);
  };

  const handleLoadOrg = orgId => {
    setLoadingOrg(true);
    setOrgId(orgId);
  };

  useEffect(() => {
    if (isLoadingEngagement) {
      setTimeout(() => {
        setActiveEngagementId(engagementId);
        window.location.reload();
      }, 500);
    } else if (isLoadingOrg) {
      setTimeout(() => {
        setActiveOrgId(orgId);
        deleteActiveEngagementId();
        window.location.reload();
      }, 500);
    }
  }, [engagementId, orgId]);

  const lcQuery = query.toLowerCase();
  const filteredEngagements = query ? engagements.filter(e => e.name.toLowerCase().includes(lcQuery)) : engagements;

  return (
    <Box>
      <Dialog
        PaperProps={{ sx: { background: '#f3f4f9' } }}
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen>
        <DialogContent sx={{ width: 1200, margin: '0 auto' }}>
          <Box sx={{ mb: 3 }}>
            <Box
              display="flex"
              position="relative"
              alignItems="center"
              justifyContent="center">
              <IconButton
                size='large'
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  left: '-8px',
                }}>
                <CloseIcon />
              </IconButton>
              <DialogTitle
                sx={{
                  textAlign: 'center',
                }}>
                Engagements in {org.name}
              </DialogTitle>
              <Button
                startIcon={<SwapHorizOutlined />}
                onClick={e => setChangeOrgMenuAnchor(e.currentTarget)}
                sx={{ position: 'absolute', right: '8px' }}
                variant='outlined'>
                Change org
              </Button>
            </Box>
            <Box m='0 auto' width={300}>
              <TextField
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
                fullWidth
                autoFocus>
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
                        onClick={() => handleLoadEngagement(e.id)}
                        sx={{ m: 2 }}
                        className='choose-engagement-btn'>
                        {
                          isLoadingEngagement && engagementId === e.id ? <CircularProgress size={20} /> : e.name
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
        PaperProps={{ sx: { minWidth: 200 } }}
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
    </Box>
  );
};