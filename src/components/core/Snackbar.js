import MUISnackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';

export default function Snackbar({ isOpen, message, type, snackBarProps = {} }) {

  const {
    actionHandler,
    actionName
  } = snackBarProps;

  const action =
    <Button
      style={{
        marginLeft: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px'
      }}
      onClick={actionHandler}
      variant='contained'
      size='small'>
      {actionName}
    </Button>;

  return (
    <div>
      <MUISnackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isOpen}>
        <Alert
          severity={type}
          className='alert'
          elevation={6}
          variant="filled">
          {message}
          {
            actionName ? action : null
          }
        </Alert>
      </MUISnackbar>
    </div>
  );
};
