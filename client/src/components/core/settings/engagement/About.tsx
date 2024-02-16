import { Box, Button, TextField, InputAdornment, Divider, Menu, Typography } from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useOutletContext } from "react-router";
import { deleteActiveEngagementId, leaveEngagement, updateEngagement } from "../../../../api/engagements";
import LogoutIcon from '@mui/icons-material/Logout';
import { AppContext } from "src/types/AppContext";

export default function About() {
  const {
    engagement,
    openDialog,
    openModal,
    openSnackBar,
    setEngagement,
    isOrgOwner,
    org
  } = useOutletContext<AppContext>();

  const [engagementName, setEngagementName] = useState(engagement.name);
  const [confirmLeaveEngagementMenu, setConfirmLeaveEngagementMenu] = useState<Element | null>(null);
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const confirmLeaveEngagementMenuOpen = Boolean(confirmLeaveEngagementMenu);

  const handleUpdateEngagement = async () => {
    if (!engagementName) {
      openSnackBar('Please enter a name for the engagement.');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await updateEngagement({
        name: engagementName,
        engagementId: engagement.id,
        orgId: org.id
      });

      if (success) {
        openSnackBar('Engagement updated.', 'success');
        setEngagement({ ...engagement, name: engagementName });
        setLoading(false);
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
  };

  const handleLeaveEngagement = async () => {
    if (isOrgOwner) {
      openSnackBar('As the org owner, you may only delete the engagement.');
      return;
    }

    setLeaving(true);

    try {
      const { success, message } = await leaveEngagement({
        orgId: org.id,
        engagementId: engagement.id
      });

      if (success) {
        openSnackBar('Left engagement.', 'success');
        deleteActiveEngagementId();
        setTimeout(() => {
          window.location.reload();
        }, 750);
      } else {
        openSnackBar(message, 'error');
        setLeaving(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        openSnackBar(error.message, 'error');
        setLeaving(false);
      }
    }
  };

  return (
    <>
      <Box>
        <TextField
          fullWidth
          value={engagementName}
          disabled={loading}
          onChange={e => setEngagementName(e.target.value)}
          variant="standard"
          helperText="Current engagement name"
          InputProps={{
            readOnly: !isOrgOwner,
            endAdornment: isOrgOwner ?
              <InputAdornment position="end">
                <LoadingButton
                  loading={loading}
                  onClick={handleUpdateEngagement}>
                  Save
                </LoadingButton>
              </InputAdornment>
              : null
          }}>
        </TextField>
      </Box>

      <Box mt={3.5}>
        <Button
          variant="outlined"
          onClick={() => openDialog('choose-engagement')}
          startIcon={<SwapHorizOutlinedIcon />}>
          Change
        </Button>
      </Box>
      <Divider className="my4" />
      <Box>
        <Button
          startIcon={isOrgOwner ? null : <LogoutIcon />}
          color="error"
          onClick={
            isOrgOwner ?
              () => openModal('delete-engagement') :
              e => setConfirmLeaveEngagementMenu(e.currentTarget)}
          variant="contained">
          {
            isOrgOwner ? 'Delete engagement' : 'Leave engagement'
          }
        </Button>
      </Box>

      <Menu
        anchorEl={confirmLeaveEngagementMenu}
        open={confirmLeaveEngagementMenuOpen}
        onClose={() => setConfirmLeaveEngagementMenu(null)}>
        <Box px={2} py={1}>
          <Typography variant="body2" mb={1}>
            Are you sure you want to leave this engagement?
          </Typography>
          <LoadingButton
            color='error'
            variant='contained'
            loading={leaving}
            onClick={handleLeaveEngagement}>
            Yes, leave
          </LoadingButton>
        </Box>
      </Menu>
    </>
  );
};
