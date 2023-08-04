/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { forwardRef, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Dialog, Grow, IconButton, InputAdornment, Menu, MenuItem, Paper, TextField, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import './styles/ChangeEngagementDialog.css';
import { SwapHorizOutlined } from "@mui/icons-material";
import { setActiveEngagementId } from '../../api/engagements';

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={300} />;
});

export default function ChangeEngagementDialog(props) {
  const {
    isOpen,
    close,
    engagements,
    org,
    engagement,
    user
  } = props;

  const [query, setQuery] = useState('');
  const [engagementId, setEngagementId] = useState(engagement.id);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isLoadingEngagement, setLoadingEngagement] = useState(false);
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

  const handleLoadEngagement = engagementId => {
    setLoadingEngagement(true);
    setEngagementId(engagementId);
  };

  useEffect(() => {
    if (engagementId !== engagement.id) {
      setTimeout(() => {
        setActiveEngagementId(engagementId);
        window.location.reload();
      }, 500);
    }
  }, [engagementId]);

  const lcQuery = query.toLowerCase();
  const filteredEngagements = query ? engagements.filter(e => e.name.toLowerCase().includes(lcQuery)) : engagements;

  return (
    <Box>
      <Dialog
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
            <Box display="flex" flexWrap="wrap" justifyContent="center" mt={3} maxWidth={1200}>
              {
                filteredEngagements.map((e, index) => {
                  return (
                    <Zoom key={e.id} appear={shouldAnimate} in style={{ transitionDelay: `${index * 17}ms` }}>
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
          user.memberOfOrgs.map(o => {
            return (
              <MenuItem
                key={o.id}
                onClick={() => { }}>
                {o.name}
              </MenuItem>
            );
          })
        }
      </Menu>
    </Box>
  );
};