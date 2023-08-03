import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Box, Drawer, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import OrgMenu from './OrgMenu';
import EngagementMenu from './EngagementMenu';
import { setActiveEngagementId } from '../../api/engagements';
import { setActiveOrgId } from '../../api/orgs';

export default function ChangeOrgOrEngagementDrawer(props) {
  const {
    org,
    isOpen,
    close,
    engagements,
    engagement,
    user,
    openSnackBar
  } = props;

  const [isLoading, setLoading] = useState(false);
  const [engagementId, setEngagementId] = useState(engagement.id);
  const [orgId, setOrgId] = useState(org.id);
  const [engagementsList, setEngagementsList] = useState(engagements);
  const [allEngagements] = useState(
    [...user.adminOfEngagements, ...user.memberOfEngagements].sort((a, b) => a.name.localeCompare(b.name))
  );

  const handleClose = () => {
    close();
    setTimeout(() => {
      setEngagementId(engagement.id);
      setOrgId(org.id);
      setEngagementsList(engagements);
      setLoading(false);
    }, 500);
  };

  const handleEngagementChange = ({ id }) => {
    setEngagementId(id);
  };

  const handleOrgChange = ({ id }) => {
    setEngagementsList(allEngagements.filter(({ orgId }) => orgId === id));
    setEngagementId('');
    setOrgId(id);
  };

  const handleSave = () => {
    if (!engagementId) {
      openSnackBar('Please select a engagement from the list.');
      return;
    }

    if (!orgId) {
      openSnackBar('Please select an organization from the list.');
      return;
    }

    setLoading(true);
    setActiveEngagementId(engagementId);
    setActiveOrgId(orgId);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        hideBackdrop
        variant='persistent'
        PaperProps={{ sx: { width: '450px' } }}>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container rowSpacing={3} columnSpacing={1.5}>
              <Grid item xs={12} mb={2}>
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
                    Change Your Engagement/Org
                  </DialogTitle>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <EngagementMenu
                  changeHandler={handleEngagementChange}
                  curEngagementId={engagementId}
                  engagements={engagementsList}
                  shouldDisable={isLoading}
                />
              </Grid>
              <Grid item xs={12}>
                <OrgMenu
                  changeHandler={handleOrgChange}
                  user={user}
                  curOrgId={orgId}
                  shouldDisable={isLoading}
                />
              </Grid>
            </Grid>
          </Box>

          <LoadingButton
            sx={{ mt: '10px' }}
            variant='contained'
            onClick={handleSave}
            type='submit'
            fullWidth
            size='large'
            loading={isLoading}>
            Save changes
          </LoadingButton>
        </DialogContent>
      </Drawer>
    </div>
  );
};