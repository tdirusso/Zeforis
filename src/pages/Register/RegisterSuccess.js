import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function RegisterSuccess() {
  return (
    <Box sx={{ textAlign: 'center', pt: '15%' }}>
      <Typography variant="h5">
        Thank you for registering.
      </Typography>
      <br></br>
      <Typography variant="body1" sx={{mb: 3}}>
        Please click on the confirmation link sent to your email address.
      </Typography>
      <CheckCircleOutlineIcon color="primary" fontSize="large"/>
    </Box>
  );
};
