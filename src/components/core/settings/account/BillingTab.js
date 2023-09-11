import { Alert, Box, Button, Divider, Paper, Slider, TextField, Typography } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useOutletContext } from "react-router-dom";
import { appLimits, pricePerAdminMonthly, stripeCustomerPortalUrl } from "../../../../lib/constants";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { createSubscription } from "../../../../api/stripe";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import ConfettiExplosion from "react-confetti-explosion";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

export default function BillingTab({ isPostPaymentSuccess }) {
  const {
    tasks,
    engagements,
    org,
    openSnackBar
  } = useOutletContext();

  const [numAdmins, setNumAdmins] = useState(1);
  const [isLoading, setLoading] = useState(false);

  var styles = window.getComputedStyle(document.body);

  const options = {
    mode: 'subscription',
    amount: (numAdmins * pricePerAdminMonthly) * 100,
    currency: 'usd',
    appearance: {
      theme: document.body.classList.contains('dark') ? 'night' : 'stripe',
      variables: {
        colorPrimary: styles.getPropertyValue('--colors-primary'),
        fontFamily: 'Inter, sans-serif',
      }
    },
  };

  const handleManualAdminCountChange = e => {
    const newVal = Number(e.target.value);
    if (newVal >= e.target.min && newVal <= e.target.max) {
      setNumAdmins(newVal);
    }
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
          <CheckoutForm
            org={org}
            isLoading={isLoading}
            setLoading={setLoading}
            openSnackBar={openSnackBar}
            numAdmins={numAdmins}
          />
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
            <Slider
              disabled={isLoading}
              defaultValue={1}
              valueLabelDisplay="auto"
              min={1}
              max={20}
              onChange={(_, val) => setNumAdmins(val)}
              value={numAdmins}
            />
            <Box className="flex-ac" justifyContent='space-between'>
              <Typography>
                Number of Administrators
              </Typography>
              <TextField
                disabled={isLoading}
                inputProps={{
                  min: '1',
                  max: '10000',
                  style: {
                    textAlign: 'center'
                  }
                }}
                style={{ width: '100px' }}
                variant="standard"
                value={numAdmins}
                type="number"
                size="small"
                onChange={handleManualAdminCountChange}
              />
            </Box>
            <Box mt='2rem' className="flex-ac" justifyContent='space-between' gap='10px'>
              <Typography>
                ${pricePerAdminMonthly.toFixed(2)} USD
                <span style={{ margin: '0 6px', color: '#bbbbbb', verticalAlign: 'text-bottom' }}>x</span>
                {numAdmins} admins
                <span style={{ margin: '0 6px', color: '#bbbbbb', verticalAlign: 'text-bottom' }}>x</span>
                1 month
              </Typography>
              <Typography>
                {
                  (numAdmins * pricePerAdminMonthly).toLocaleString('en', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                &nbsp;USD
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="caption" color='#6d6e78'>
                Upgrading to Zeforis Pro means you and every additional administrator with have <strong>unlimited resources</strong> inside of the platform.
              </Typography>
            </Box>
            <Divider className="my4" />
            <Box>
              <Box className="flex-ac" justifyContent='space-between' gap='10px'>
                <Box component='h3'>
                  Due today
                </Box>
                <Box component='h3'>
                  {
                    (numAdmins * pricePerAdminMonthly).toLocaleString('en', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  &nbsp;USD
                </Box>
              </Box>
            </Box>
            <Box mt={2}>
              <Typography variant="caption" color='#6d6e78'>
                This is an estimate. You’ll be charged based on the number of administrators in {org.name} on your renewal date.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

function CheckoutForm({ isLoading, setLoading, openSnackBar, org, numAdmins }) {
  const [subscriptionFoundModalOpen, setSubscriptionFoundModalOpen] = useState(false);

  const {
    user
  } = useOutletContext();

  const stripe = useStripe();
  const elements = useElements();

  const handlePurchase = async () => {

    // window.location.href = `${process.env.REACT_APP_APP_DOMAIN}/home/settings?paymentSuccess=true`;
    // return;
    if (numAdmins <= 0 || numAdmins >= 10000) {
      openSnackBar('Number of administrators must be between 1 and 10,000.');
      return;
    }

    const { error } = await elements.submit();

    if (error) {
      if (error.type !== 'validation_error') {
        openSnackBar(error.message);
      }
      return;
    }

    setLoading(true);

    try {
      const {
        clientSecret,
        message,
        hasSubscription
      } = await createSubscription({
        orgId: org.id,
        numAdmins
      });

      if (clientSecret) {
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${process.env.REACT_APP_APP_DOMAIN}/home/settings?paymentSuccess=true`,
          },
          redirect: 'always'
        });

        if (error) {
          console.log(error);
        } else {
          console.log('completed!');
        }
      } else if (hasSubscription) {
        setSubscriptionFoundModalOpen(true);
        setLoading(false);
      }

      else {
        openSnackBar(message, 'error');
        setLoading(false);
      }
    } catch (error) {
      openSnackBar(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <form>
      <PaymentElement options={{ terms: { card: 'never' } }} />
      <Box mt='3rem'>
        <LoadingButton
          loading={isLoading}
          onClick={handlePurchase}
          size="large"
          variant="contained"
          fullWidth
          style={{ marginBottom: '1rem' }}>
          Purchase Zeforis Pro
        </LoadingButton>
        <Typography variant="caption" color='#6d6e78'>
          You can cancel your plan at any time.
          By submitting this form, you confirm that you agree to
          our <a href="https://www.zeforis.com/terms-of-service" target="_blank" rel="noreferrer">Terms of Service </a>
          and <a href="https://www.zeforis.com/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </Typography>
      </Box>
      <Box>
        <ConfettiExplosion />
        <SubscriptionFoundModal
          subscriptionFoundModalOpen={subscriptionFoundModalOpen}
          setSubscriptionFoundModalOpen={setSubscriptionFoundModalOpen}
          email={user.email}
        />
      </Box>
    </form>
  );
}

function SubscriptionFoundModal(props) {

  const {
    subscriptionFoundModalOpen,
    setSubscriptionFoundModalOpen,
    email
  } = props;

  const handleClose = () => setSubscriptionFoundModalOpen(false);

  const handleOpenCustomerPortal = () => {
    window.open(stripeCustomerPortalUrl, '_blank');
    handleClose();
  };

  return (
    <Dialog
      open={subscriptionFoundModalOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        Subscription Found
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          You just tried to create a new subscription, but we found an existing subscription tied to your email ({email}).
          <br></br>
          <br></br>
          <Button 
          variant='contained'
          size='large' 
          onClick={handleOpenCustomerPortal}>
            Manage subscription
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}