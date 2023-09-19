import { Alert, Box, Button, Divider, Paper, Slider, TextField, Typography } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { useOutletContext } from "react-router-dom";
import { pricePerAdminMonthly, stripeCustomerPortalUrl } from "../../../../lib/constants";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { createSubscription } from "../../../../api/stripe";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import ConfettiExplosion from "react-confetti-explosion";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AlertTitle from "@mui/material/AlertTitle/AlertTitle";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

export default function BillingTab({ isPaymentSuccess }) {
  const {
    user
  } = useOutletContext();

  const {
    plan,
    subscriptionStatus
  } = user;

  const getBillingInfo = () => {
    if (isPaymentSuccess) {
      return <PaymentSuccessInfo />;
    }

    if (plan === 'free') {
      return <FreePlanInfo status={subscriptionStatus} />;
    } else if (plan === 'pro') {
      return <ProPlanInfo status={subscriptionStatus} />;
    }
  };

  return (
    <Box className="billing-tab">
      {
        getBillingInfo()
      }
    </Box>
  );
};

function ProPlanInfo({ status }) {
  return (
    <Box>
      <Box component="h3">
        Your Plan
      </Box>
      <Divider className="my2" />
      <Typography fontSize='1.25rem' fontWeight={300}>
        Zeforis Pro &nbsp;🎉
      </Typography>
      <Typography mt={1}>
        {
          status === 'past_due' ?
            `You are currently subscribed to Zeforis Pro, but your subscription is past due.  
            Click the button below to update your subscription details to continue using Zeforis Pro, or your subscription will soon be canceled.
          `
            :
            'You are currently subscribed to Zeforis Pro.  You can click the button below to manage your subscription.'
        }
      </Typography>
      <Box mt={3}>
        <a href={stripeCustomerPortalUrl}>
          <Button variant="contained" size="large">
            Manage subscription
          </Button>
        </a>
      </Box>
    </Box>
  );
}

function FreePlanInfo({ status }) {
  const {
    org,
    orgUsers,
    openSnackBar
  } = useOutletContext();

  let numOrgAdmins = 0;

  orgUsers.forEach(({ adminOfEngagements }) =>
    adminOfEngagements.length > 0 ? numOrgAdmins++ : null
  );

  const [numAdmins, setNumAdmins] = useState(numOrgAdmins);
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
    if (newVal >= numOrgAdmins && newVal <= e.target.max) {
      setNumAdmins(newVal);
    }
  };

  return (
    <Box>
      <Box component="h3">
        Your Plan
      </Box>
      <Divider className="my2" />
      <Typography fontSize='1.25rem' fontWeight={300}>
        Zeforis Starter (Free) &nbsp;🙂
      </Typography>
      <Typography mt={1}>
        You are currently using the free version of Zeforis.
        <br></br>
        If you would like to upgrade to Zeforis Pro to take advantage of additional administrators, as well as unlimited engagements and tasks, please complete the payment form below.
      </Typography>
      <Box className="free-plan-info" mt={4} hidden={status !== 'canceled'}>
        <Alert severity="info">
          <AlertTitle>
            <strong>Info</strong>
          </AlertTitle>
          <Typography>
            It looks like your subscription is in a <strong>canceled</strong> status.
            To re-activate Zeforis Pro, you must create a new subscription and pay for, at least, the number of administrators in {org.name}, which is <strong>{numOrgAdmins}</strong>.
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
              min={0}
              max={20}
              onChange={(_, val) => val >= numOrgAdmins ? setNumAdmins(val) : null}
              value={numAdmins}
            />
            <Box className="flex-ac" justifyContent='space-between'>
              <Typography>
                Number of Administrators
              </Typography>
              <TextField
                disabled={isLoading}
                inputProps={{
                  min: numOrgAdmins,
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
                Upgrading to Zeforis Pro means you and your administrators with have <strong>unlimited resources</strong> inside of the platform.
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
}

function CheckoutForm({ isLoading, setLoading, openSnackBar, org, numAdmins }) {
  const [subscriptionFoundModalOpen, setSubscriptionFoundModalOpen] = useState(false);

  const {
    user
  } = useOutletContext();

  const stripe = useStripe();
  const elements = useElements();

  const handlePurchase = async () => {
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
            return_url: `${process.env.REACT_APP_APP_DOMAIN}/home/settings?isPaymentSuccess=true`,
          },
          redirect: 'always'
        });

        if (error) {
          openSnackBar(error.message);
          setLoading(false);
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
      onClose={handleClose}>
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

function PaymentSuccessInfo() {
  return (
    <Box className='payment-success'>
      <Alert severity="success">
        <AlertTitle style={{ fontWeight: '600', fontSize: '1.07rem' }}>Payment Successful</AlertTitle>
        <Box className='flex-centered'>
          <ConfettiExplosion
            zIndex={100}
            force={1}
            width={window.innerWidth}
            duration={3000}
            particleCount={300}
          />
        </Box>
        <br></br>
        <Typography>
          Thank you for signing up for <strong>Zeforis Pro</strong>!
        </Typography>
        <br></br>
        <Typography>
          Our systems will soon recieve payment confirmation and provision you with full access.
          <br></br>
          You can always come back to this page to check your subscription status & manage your subscription.
        </Typography>
        <br></br>
        <a href='/home/dashboard'>
          <Button size='large' variant='contained'>
            Continue to dashboard
          </Button>
        </a>
      </Alert>
    </Box>
  );
}