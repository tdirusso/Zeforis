import { LoadingButton } from "@mui/lab";
import { Box, Divider, Grid, Paper, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { updateProfile } from "../../../api/user";

export default function BasicInformation() {
  const [isLoading, setLoading] = useState(false);

  const { 
    user, 
    setUser,
    openSnackBar
  } = useOutletContext();

  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();

  const handleProfileUpdate = async () => {
    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!firstNameVal || !lastNameVal) {
      openSnackBar('Please enter a first and last name.', 'error');
      return;
    }

    setLoading(true);

    try {
      const { success, message } = await updateProfile({
        firstName: firstNameVal,
        lastName: lastNameVal
      });

      if (success) {
        setUser({
          ...user,
          firstName: firstNameVal,
          lastName: lastNameVal
        });
        setLoading(false);
        openSnackBar('Profile successfully updated.', 'success');
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
      <Paper>
        <Box component="h6">Basic Information</Box>
        <Divider sx={{ my: 4 }} />

        <Grid container rowSpacing={4} columnSpacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              fullWidth
              disabled={isLoading}
              inputRef={firstName}
              defaultValue={user.firstName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              fullWidth
              disabled={isLoading}
              inputRef={lastName}
              defaultValue={user.lastName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              inputRef={email}
              defaultValue={user.email}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              onClick={handleProfileUpdate}
              loading={isLoading}
              variant="contained">
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
