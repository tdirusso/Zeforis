import { Box, Button, Typography } from "@mui/material";
import approveMailGif from '../../assets/approve-mail.gif';

export default function RegisterSuccess() {
  return (
    <Box style={{ textAlign: 'center', padding: '15%' }}>
      <img src={approveMailGif} height={150} alt='' />
      <Typography variant="h5">
        Thank you for registering.
      </Typography>
      <br></br>
      <Typography variant="body1" >
        Please click on the confirmation link sent to your email address.
      </Typography>
      <Box mt={3}>
        <Button variant="contained" size="large" component='a' href='../login'>
          Return to Login
        </Button>
      </Box>
    </Box>
  );
};
