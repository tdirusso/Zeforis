import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogTitle, Typography } from '@mui/material';
import { stripeCustomerPortalUrl } from '../../lib/constants';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export default function SubscriptionPastDueModal(props) {

  const {
    isOpen,
    close
  } = props;

  const setSupressPastDue = () => {
    sessionStorage.setItem('supressPastDue', 'true');
  };

  const handleDismiss = () => {
    setSupressPastDue();
    close();
  };

  const handleClose = () => {
    close();
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose} className='modal'>
        <DialogTitle style={{ display: 'flex', alignItems: 'end', lineHeight: '1.25' }}>
          <WarningAmberRoundedIcon
            htmlColor='#ffa65c'
            style={{ marginRight: '5px', fontSize: '1.8rem' }}
          />
          Your subscription is past due
        </DialogTitle>
        <DialogContent>
          <Typography>
            We have not received payment to renew your Zeforis Pro subscription.
          </Typography>
          <Typography mt={1} mb={4}>
            Please click the button
            below to manage your subscription to avoid a lapse in service.
          </Typography>
          <DialogActions style={{ padding: 0 }} className='wrap-on-small'>
            <Button
              onClick={handleDismiss}>
              Dismiss
            </Button>
            <a href={stripeCustomerPortalUrl} onClick={setSupressPastDue} target='_blank' rel='noreferrer'>
              <Button
                variant='contained'>
                Manage subscription
              </Button>
            </a>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};