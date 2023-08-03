import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { forwardRef } from 'react';
import { Box, Dialog, Grid, Grow, IconButton, Paper, Zoom } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} timeout={300} />;
});

export default function ChangeEngagementDialog(props) {
  const {
    isOpen,
    close,
    engagements,
  } = props;

  const handleClose = () => {
    close();
    setTimeout(() => {

    }, 500);
  };

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Grid container rowSpacing={3} columnSpacing={1.5}>
              <Grid item xs={12} mb={2}>
                <Box
                  display="flex"
                  position="relative"
                  alignItems="center"
                  justifyContent="center">
                  <IconButton
                    size='large'
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      left: '-8px',
                    }}>
                    <CloseIcon />
                  </IconButton>
                  <DialogTitle
                    sx={{
                      textAlign: 'center',
                    }}>
                    Change Your Engagement/Org
                  </DialogTitle>
                </Box>
              </Grid>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {
                  engagements.map((c, index) => {
                    return (
                      <Zoom key={c.id} appear in style={{ transitionDelay: `${index * 17}ms` }}>
                        <Paper sx={{ m: 2 }}>
                          {c.name}
                        </Paper>
                      </Zoom>
                    );
                  })
                }
              </Box>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};