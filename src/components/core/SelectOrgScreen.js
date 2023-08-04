/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Paper, Zoom } from '@mui/material';
import './styles/ChangeEngagementDialog.css';
import { setActiveOrgId } from '../../api/orgs';

export default function SelectOrgScreen(props) {
  const {
    user
  } = props;

  const [orgId, setOrgId] = useState();
  const [isLoadingOrg, setLoadingOrg] = useState(false);

  const handleLoadOrg = orgId => {
    setLoadingOrg(true);
    setOrgId(orgId);
  };

  useEffect(() => {
    if (isLoadingOrg) {
      setTimeout(() => {
        setActiveOrgId(orgId);
        window.location.reload();
      }, 500);
    }
  }, [orgId]);

  return (
    <Box>
      <DialogContent sx={{ width: 1200, margin: '0 auto' }}>
        <Box sx={{ mb: 3 }}>
          <Box
            display="flex"
            position="relative"
            alignItems="center"
            justifyContent="center">
            <DialogTitle
              sx={{
                textAlign: 'center',
              }}>
              Choose an Organization
            </DialogTitle>
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            mt={3}
            maxWidth={1200}>
            {
              user.memberOfOrgs.map((org, index) => {
                return (
                  <Zoom key={org.id} appear in style={{ transitionDelay: `${index * 50}ms` }}>
                    <Paper
                      onClick={() => handleLoadOrg(org.id)}
                      sx={{ m: 2 }}
                      className='choose-engagement-btn'>
                      {
                        isLoadingOrg && orgId === org.id ? <CircularProgress size={20} /> : org.name
                      }
                    </Paper>
                  </Zoom>
                );
              })
            }
          </Box>
        </Box>
      </DialogContent>
    </Box>
  );
};
