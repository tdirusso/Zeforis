import { Box, Button, Menu, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useOutletContext } from "react-router";
import { useRef } from "react";
import { sendPasswordResetLink, updateUser } from "../../../../api/users";
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

export default function Profile() {
  const [isUpdatingName, setUpdatingName] = useState(false);
  const [isSendingResetLink, setSendingResetLink] = useState(false);
  const [changePasswordMenuAnchor, setChangePasswordMenuAnchor] = useState(null);

  const changePasswordMenuOpen = Boolean(changePasswordMenuAnchor);

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
        first_name: firstNameVal,
        last_name: lastNameVal
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

  const handleSendPasswordResetLink = () => {
    setSendingResetLink(true);

    setTimeout(async () => {
      try {
        const { success, message, isLinkPending } = await sendPasswordResetLink({
          email: user.email
        });

        if (success) {
          if (isLinkPending) {
            setChangePasswordMenuAnchor(null);
            openSnackBar('Reset link already sent - once expired, you can try again.');
          } else {
            setChangePasswordMenuAnchor(null);
            openSnackBar('Password reset link sent.', 'success');
          }

          setTimeout(() => {
            setSendingResetLink(false);
          }, 250);
        } else {
          openSnackBar(message, 'error');
          setSendingResetLink(false);
        }
      } catch (error) {
        openSnackBar(error.message, 'error');
        setSendingResetLink(false);
      }
    }, 1000);
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

      <Box component="h4" mt='4rem'>Email & Password</Box>
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
        <Box my={3}>
          <Button
            onClick={e => setChangePasswordMenuAnchor(e.currentTarget)}
            variant="outlined"
            startIcon={<LockResetRoundedIcon />}>
            Change password
          </Button>
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
      <Menu
        PaperProps={{ style: { maxWidth: 350 } }}
        anchorEl={changePasswordMenuAnchor}
        open={changePasswordMenuOpen}
        onClose={() => setChangePasswordMenuAnchor(null)}>
        <Box px={2} py={1}>
          <Typography variant="body2">
            To change your password, click on the button below to send a password reset link to your email listed above (expires after 1 hour).
          </Typography>
          <Box mt={2}>
            <LoadingButton
              fullWidth
              size="small"
              loading={isSendingResetLink}
              startIcon={<SendRoundedIcon />}
              onClick={handleSendPasswordResetLink}
              variant="contained">
              Send reset link
            </LoadingButton>
          </Box>
        </Box>
      </Menu>
    </>
  );
};
