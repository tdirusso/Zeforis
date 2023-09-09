import { Alert, Box, Divider, Paper, Slider, TextField, Typography } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useOutletContext } from "react-router-dom";
import { appLimits } from "../../../../lib/constants";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

export default function BillingTab() {
  const {
    user,
    tasks,
    engagements
  } = useOutletContext();

  const [numAdmins, setNumAdmins] = useState(1);

  var styles = window.getComputedStyle(document.body);

  const options = {
    mode: 'subscription',
    amount: 1099,
    currency: 'usd',
    appearance: {
      theme: document.body.classList.contains('dark') ? 'night' : 'stripe',
      variables: {
        colorPrimary: styles.getPropertyValue('--colors-primary'),
        fontFamily: 'Inter, sans-serif',
      }
    },
  };

  return (
    <Box className="billing-tab">
      <Box className="free-plan-info">
        <Alert severity="warning">
          <Typography>
            You are currently on the Zeforis <strong>FREE</strong> plan.
          </Typography>
          <Typography>
            <strong>Resource Usage</strong>
            <br></br>
            {tasks.length} / {appLimits.freePlanTasks} Tasks
            <br></br>
            {engagements.length} / {appLimits.freePlanEngagements} Engagements
          </Typography>
        </Alert>
      </Box>
      <Box className="payment-content">
        <Elements stripe={stripePromise} options={options}>
          <form>
            <PaymentElement />
            <Box mt='2rem'>
              <LoadingButton size="large" variant="contained" fullWidth>
                Purchase Zeforis Pro
              </LoadingButton>
            </Box>
          </form>
        </Elements>
        <Paper className="payment-details">
          <Box className="header">
            <Box>
              <Box component='h3'>Zeforis Pro Estimate</Box>
            </Box>
            <Box className="currency">
              USD
            </Box>
          </Box>
          <Box padding='2rem'>
            <Box textAlign='center' mb={1}>
              <Typography>
                Number of Administrators
              </Typography>
            </Box>
            <Slider
              defaultValue={50}
              valueLabelDisplay="auto"
              min={1}
              max={100}
              onChange={(_, val) => setNumAdmins(val)}
              value={numAdmins}
            />
            <TextField
            value={numAdmins}
              type="number"
              size="small"
              onChange={e => setNumAdmins(Number(e.target.value))}
            />
            {numAdmins}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
