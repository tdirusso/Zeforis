import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function RegisterSuccess() {
  return (
    <Box style={{ textAlign: 'center', padding: '15%' }}>
      <Typography variant="h5">
        Thank you for registering.
      </Typography>
      <br></br>
      <Typography variant="body1" style={{ marginBottom: '1.5rem' }}>
        Please click on the confirmation link sent to your email address.
      </Typography>
      <CheckCircleOutlineIcon color="primary" fontSize="large" />
    </Box>
  );
};
