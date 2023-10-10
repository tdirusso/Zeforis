import { Box, Typography } from "@mui/material";
import approveMailGif from '../../assets/approve-mail.gif';

export default function RegisterSuccess() {
  return (
    <Box style={{ textAlign: 'center', padding: '15%' }}>
      <Typography variant="h5">
        Thank you for registering.
      </Typography>
      <br></br>
      <Typography variant="body1" >
        Please click on the confirmation link sent to your email address.
      </Typography>
      <img src={approveMailGif} height={150} alt='' />
    </Box>
  );
};
