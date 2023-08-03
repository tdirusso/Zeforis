import EngagementMenu from '../core/EngagementMenu';
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "./Snackbar";
import { setActiveEngagementId } from '../../api/engagements';
import { Box, Paper, Typography } from '@mui/material';

export default function SelectEngagementScreen({ engagement, engagements }) {
  const {
    isOpen,
    openSnackBar,
    type,
    message
  } = useSnackbar();

  const handleSelection = (engagementObject) => {
    setActiveEngagementId(engagementObject.id);
    openSnackBar(`Loading ${engagementObject.name}...`, 'info');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <Paper sx={{ p: 5, width: 600 }}>
        <Box component="h3" mb={1}>
          Select a Engagement
        </Box>
        <Typography>
          Please select which engagement you would like to work on from the menu below.
        </Typography>
        <br></br>
        <EngagementMenu
          changeHandler={handleSelection}
          curEngagementId={engagement?.id}
          engagements={engagements}
        />
      </Paper>

      <Snackbar
        isOpen={isOpen}
        type={type}
        message={message}
      />
    </>
  );
};