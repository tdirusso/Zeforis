/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import {
  Box,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import userMenuIcon from '../../assets/user-menu-icon.png';
import { Folder } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './styles.scss';

const flexCenterStyle = {
  display: 'flex',
  alignItems: 'center'
};

export default function GettingStartedDrawer(props) {
  const {
    isOpen,
    close,
  } = props;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={close}
      hideBackdrop
      className='getting-started-drawer'
      variant='persistent'
      PaperProps={{
        sx: {
          width: '450px',
          py: 0,
        }
      }}>
      <DialogContent>
        <Box
          mb={3}
          display="flex"
          position="relative"
          alignItems="center"
          justifyContent="center">
          <IconButton
            size='large'
            onClick={close}
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
            Getting Started
          </DialogTitle>
        </Box>
        <Divider sx={{ mt: 0, mb: 4 }} />
        <Box>
          <Box component="h3">
            Welcome to Zeforis.
          </Box>
          <Box component="h4" mt={0.5}>
            Your engagements, your brand, one place.
          </Box>
          <Divider sx={{ mt: 4, mb: 2 }} />
          <Typography mt={2}>
            We'll guide you through getting started with your first engagement, customization, and collaboration.
            Embrace efficiency and conquer your consulting world with ease.
          </Typography>
          <Typography mt={2}>
            And if you ever need to re-open this guide,
            just click the User Menu icon in the top right
            and select "Help":
          </Typography>
          <Box mt={0.5}>
            <img src={userMenuIcon}
              alt=""
              style={{ border: '1px solid #e9e9e9', borderRadius: '50%' }}
              height={45}
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box component="h3" mt={0.5} sx={flexCenterStyle}>
            <Folder htmlColor='grey' sx={{ mr: 0.5 }} />
            Folders
          </Box>
          <Typography mt={2}>
            The first step in getting your engagement off the ground is by creating folders.
          </Typography>
          <Typography mt={2}>
            Folders are your way of organizing and dividing tasks.  Each and every task must reside in a folder.
          </Typography>
          <Typography mt={2}>
            <Link to="/home/folders" component="a">Go to folders</Link>

          </Typography>
        </Box>
      </DialogContent>
    </Drawer>
  );
};