import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { Box, Drawer, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import OrgMenu from './OrgMenu';
import ClientMenu from './ClientMenu';
import { setActiveClientId } from '../../api/clients';
import { setActiveOrgId } from '../../api/orgs';

export default function ChangeOrgOrClientDrawer(props) {
  const {
    org,
    isOpen,
    close,
    clients,
    client,
    user,
    openSnackBar
  } = props;

  const [isLoading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(client.id);
  const [orgId, setOrgId] = useState(org.id);
  const [clientsList, setClientsList] = useState(clients);
  const [allClients] = useState(
    [...user.adminOfClients, ...user.memberOfClients].sort((a, b) => a.name.localeCompare(b.name))
  );

  const handleClose = () => {
    close();
    setTimeout(() => {
      setClientId(client.id);
      setOrgId(org.id);
      setClientsList(clients);
      setLoading(false);
    }, 500);
  };

  const handleClientChange = ({ id }) => {
    setClientId(id);
  };

  const handleOrgChange = ({ id }) => {
    setClientsList(allClients.filter(({ orgId }) => orgId === id));
    setClientId('');
    setOrgId(id);
  };

  const handleSave = () => {
    if (!clientId) {
      openSnackBar('Please select a client from the list.');
      return;
    }

    if (!orgId) {
      openSnackBar('Please select an organization from the list.');
      return;
    }

    setLoading(true);
    setActiveClientId(clientId);
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
                    Change Your Client/Org
                  </DialogTitle>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <ClientMenu
                  changeHandler={handleClientChange}
                  curClientId={clientId}
                  clients={clientsList}
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
            Save Changes
          </LoadingButton>
        </DialogContent>
      </Drawer>
    </div>
  );
};