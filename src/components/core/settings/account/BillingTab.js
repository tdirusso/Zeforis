import { Box } from "@mui/material";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);

export default function BillingTab() {
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
    <Box>
      <Elements stripe={stripePromise} options={options}>
        <form>
          <PaymentElement />
          <button>Submit</button>
        </form>
      </Elements>
    </Box>
  );
};
