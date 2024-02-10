import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router";
import { useRef } from "react";
import { updateUser } from "../../../../api/users";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
export default function Profile() {
  const [isUpdatingName, setUpdatingName] = useState(false);
  const {
    user,
    setUser,
    openSnackBar,
    openModal
  } = useOutletContext();

  const firstName = useRef();
  const lastName = useRef();
  const email = useRef();

  const hasOrg = user.memberOfOrgs.some(org => org.ownerId === user.id);

  const handleProfileUpdate = async () => {
    const firstNameVal = firstName.current.value;
    const lastNameVal = lastName.current.value;

    if (!firstNameVal || !lastNameVal) {
      openSnackBar('Please enter a first and last name.', 'error');
      return;
    }

    setUpdatingName(true);

    try {
      const { success, message } = await updateUser(user.id, {
        firstName: firstNameVal,
        lastName: lastNameVal
      });

      if (success) {
        setUser({
          ...user,
          firstName: firstNameVal,
          lastName: lastNameVal
        });
        setUpdatingName(false);
        openSnackBar('Profile updated.', 'success');
      } else {
        openSnackBar(message, 'error');
        setUpdatingName(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setUpdatingName(false);
    }
  };

  return (
    <>
      <Box component="h4">Personal</Box>
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }} mt={3}>
        <Box maxWidth={450} flex={1} minWidth={250}>
          <TextField
            fullWidth
            variant="standard"
            label="First Name"
            disabled={isUpdatingName}
            inputRef={firstName}
            defaultValue={user.firstName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Box maxWidth={450} flex={1} minWidth={250}>
          <TextField
            fullWidth
            variant="standard"
            label="Last Name"
            disabled={isUpdatingName}
            inputRef={lastName}
            defaultValue={user.lastName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      <Box my={4}>
        <LoadingButton
          onClick={handleProfileUpdate}
          loading={isUpdatingName}
          variant="contained">
          Save changes
        </LoadingButton>
      </Box>

      <Box component="h4" mt='4rem'>Email</Box>
      <Box my={3}>
        <Box maxWidth={600}>
          <TextField
            variant="standard"
            label="Email"
            inputRef={email}
            fullWidth
            defaultValue={user.email}
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon htmlColor="#cbcbcb" />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      <Box hidden={hasOrg}>
        <Box component="h4" mt='4rem'>Establish Your Own Organization</Box>
        <Box my={3}>
          <Typography mb={1}>
            If you'd like to create your own organization and establish a dedicated space for your engagements, team members, and collaborations, click below.
          </Typography>
          <a href="/create-org">
            <Button variant="contained">
              Create an organization
            </Button>
          </a>
        </Box>
      </Box>

      <Box component="h4" mt='4rem'>Close Your Account</Box>
      <Typography mt={1} mb={2}>
        Notice - when you close your account, all data associated with it is immediately deleted and can't be recovered.  Any active subscription will also be canceled.
      </Typography>
      <Button
        onClick={() => openModal('close-account')}
        color="error"
        variant="contained">
        Close account
      </Button>
    </>
  );
};
