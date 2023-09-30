import { Component } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Typography } from "@mui/material";
import Watermark from "./Watermark";
import { logFrontendError } from "../../api/logs";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error, info) {
    try {
      await logFrontendError({
        errorStack: error.stack,
        componentStack: info.componentStack
      });
    } catch (newError) {
      console.log('Error attempting to log frontend error:  ', newError);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }) {
  return (
    <Box
      bgcolor='white'
      padding={2}
      textAlign="center"
      className="flex-centered"
      height='100vh'
      flexDirection="column">
      <Box maxWidth={650} margin="0 auto">
        <Box>
          <ErrorOutlineIcon style={{ fontSize: '5rem' }} color="error" />
        </Box>
        <Box mt={2}>
          <Box component="h1">Something went wrong</Box>
        </Box>
        <Box mt={2}>
          <Typography fontSize="1.25rem">
            The issue has been logged for investigation.
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography fontSize="1.1rem">
            Click below to either refresh the page or return to the login page.
            <br></br>
            If you continue to see this message, please
            <a
              href={`mailto:info@zeforis.com?subject=Error using Zeforis Application&body=I encountered the following error: %0D%0A%0D%0A${error.stack}`}> click here </a>
            to contact us.
          </Typography>
        </Box>
        <Box mt={2.5}>
          <Button
            onClick={() => window.location.reload()}
            size="large"
            variant="contained">
            Refresh page
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="outlined"
            onClick={() => window.location.href = '/login'}
            size="large">
            Return to login
          </Button>
        </Box>
        <Watermark positionStyle={{ bottom: 10, right: 10, position: 'absolute' }}></Watermark>
      </Box>
    </Box>
  );
}