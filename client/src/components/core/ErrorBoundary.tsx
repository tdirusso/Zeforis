import { Component, ReactNode } from "react";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box, Button, Paper, Typography } from "@mui/material";
import Watermark from "./Watermark";
import { logFrontendError } from "../../api/logs";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error
    };
  }

  async componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      await logFrontendError({
        errorStack: error.stack,
        componentStack: info.componentStack
      });
    } catch (newError) {
      console.log('Error attempting to log frontend error:  ', newError);
    }
  }

  public render() {
    if (this.state.hasError) {
      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error | null; }) {
  return (
    <Paper
      style={{ height: '100vh' }}
      className="flex-centered">
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
              href={`mailto:info@zeforis.com?subject=Error using Zeforis Application&body=I encountered the following error: %0D%0A%0D%0A${error?.stack}`}> click here </a>
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
    </Paper>
  );
}