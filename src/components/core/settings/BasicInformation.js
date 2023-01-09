import { LoadingButton } from "@mui/lab";
import { Box, Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function BasicInformation() {
  const [isLoading, setLoading] = useState(false);

  const { user, setUser } = useOutletContext();

  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();

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
              variant="contained">
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
