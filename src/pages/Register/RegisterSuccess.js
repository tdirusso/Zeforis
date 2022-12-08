import { Box, Typography } from "@mui/material";

export default function RegisterSuccess() {
  return (
    <Box sx={{ textAlign: 'center', pt: '15%' }}>
      <Typography variant="h5">
        Thank you for registering.
      </Typography>
      <br></br>
      <Typography variant="body1">
        Please click on the confirmation link sent to your email address.
      </Typography>
    </Box>
  );
};
