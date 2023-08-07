import { Box, Button, TextField, InputAdornment, Divider } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useOutletContext } from "react-router";
import { updateEngagement } from "../../../../api/engagements";

export default function GeneralTab() {
  const {
    engagement,
    openDialog,
    openModal,
    openSnackBar,
    setEngagement
  } = useOutletContext();

  const [engagementName, setEngagementName] = useState(engagement.name);
  const [loading, setLoading] = useState(false);

  const handleUpdateEngagement = async () => {
    if (!engagementName) {
      openSnackBar('Please enter a name for the engagement.');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await updateEngagement({
        name: engagementName,
        engagementId: engagement.id
      });

      if (success) {
        openSnackBar('Engagement updated.', 'success');
        console.log({ ...engagement, name: engagementName, });
        setEngagement({ ...engagement, name: engagementName });
        setLoading(false);
      } else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <>
      <Box mt={4}>
        <TextField
          style={{ minWidth: '400px' }}
          value={engagementName}
          disabled={loading}
          onChange={e => setEngagementName(e.target.value)}
          variant="standard"
          helperText={`Current engagement name`}
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <LoadingButton
                loading={loading}
                onClick={handleUpdateEngagement}>
                Save
              </LoadingButton>
            </InputAdornment>
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
          startIcon={<DeleteIcon />}
          color="error"
          onClick={() => openModal('delete-engagement')}
          variant="outlined">
          Delete engagement
        </Button>
      </Box>
    </>
  );
};
