import MUISnackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Snackbar({ isOpen, message, type }) {
  return (
    <div>
      <MUISnackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isOpen}>
        <Alert
          severity={type}
          sx={{ width: '100%', fontWeight: 300 }}
          elevation={6}
          variant="filled">
          {message}
        </Alert>
      </MUISnackbar>
    </div>
  )
};
