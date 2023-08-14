/* eslint-disable react-hooks/exhaustive-deps */
import DialogContent from '@mui/material/DialogContent';
import {
  Alert,
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
import StarIcon from '@mui/icons-material/Star';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
export default function AdminGettingStartedDrawer(props) {
  const {
    isOpen,
    close,
    org,
    engagement
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
        style: {
          width: '450px',
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
            style={{
              position: 'absolute',
              left: '-8px',
            }}>
            <CloseIcon />
          </IconButton>
          <DialogTitle
            style={{
              textAlign: 'center',
            }}>
            Getting Started
          </DialogTitle>
        </Box>
        <Divider style={{ marginBottom: '2rem' }} />
        <Box>
          <Box component="h3">
            Welcome to Zeforis.
          </Box>
          <Box component="h4" mt={1.5}>
            Specifically, the {org.name} custom portal.
          </Box>
          <Typography mt={1.5}>
            Your engagements, your brand, one place.
          </Typography>
          <Divider style={{ marginTop: '2rem', marginBottom: '1rem' }} />
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
          <Divider className='my2' />
          <Box component="h3" mt={0.5} className='flex-ac'>
            <Folder htmlColor='grey' style={{ marginRight: '5px' }} />
            Folders
          </Box>
          <Typography mt={2}>
            The first step in getting your engagement off the ground is by creating folders.
          </Typography>
          <Typography mt={2}>
            Folders are your way of organizing and dividing tasks.  Each and every task must reside in a folder.
          </Typography>
          <Typography mt={2}>
            <Link to="/home/folders" component="a">Go to folders &rarr;</Link>
          </Typography>
          <Typography mt={2}>
            From this page, you can create new folders, edit or delete existing folders,
            and view the tasks within a folder by clicking on the individual folder icon.
          </Typography>
          <Typography mt={2}>
            You'll notice there is a section for
            <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key folders, as well as Other folders.
          </Typography>
          <Typography mt={2}>
            <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key folders are a method of organizing your folders,
            specifically folders that may contain more pressing or important tasks than others.  Key folders will automatically appear
            on the dashboard and display a list of up to 5 tasks from within that folder that can be quickly viewed and/or updated,
            as well as an in-line button to open the task's URL link (if applicable).
          </Typography>
          <Typography mt={2}>
            Click the "New Folder" button and create a folder - this guide will re-open afterwards!
          </Typography>
          <Divider className='my2' />
          <Box component="h3" mt={0.5} className='flex-ac'>
            <TaskAltIcon htmlColor='grey' style={{ marginRight: '5px' }} />
            Tasks
          </Box>
          <Typography mt={2}>
            Once you have created your folders, you can start creating tasks to reside in those folders.
          </Typography>
          <Typography mt={2}>
            <Link to="/home/tasks" component="a">Go to tasks &rarr;</Link>
          </Typography>
          <Typography mt={2}>
            From this page, you can create new tasks and view/edit all tasks for the current engagement,
            in this case, <strong>{engagement.name}</strong>.
          </Typography>
          <Typography mt={2}>
            When creating a task, you'll be asked for the following fields:
          </Typography>
          <Box mt={2}>
            <ul>
              <li>
                <Typography>
                  Task name &nbsp;<span style={{ color: '#b5b5b5', fontSize: '.8rem', verticalAlign: 'text-top' }}>required</span>
                </Typography>
              </li>
              <li>
                <Typography>
                  Folder &nbsp;<span style={{ color: '#b5b5b5', fontSize: '.8rem', verticalAlign: 'text-top' }}>required</span>
                </Typography>
              </li>
              <li>
                <Typography>Link URL</Typography>
              </li>
              <li>
                <Typography>Assigned to</Typography>
              </li>
              <li>
                <Typography>Tags</Typography>
              </li>
            </ul>
          </Box>
          <Typography mt={2}>
            Tags are like labels that are used to further categorize tasks.
          </Typography>
          <Typography mt={2}>
            The Link URL field is used to store an external link associated with the task, if applicable.
          </Typography>
          <Typography mt={2}>
            Click on "New Task" to create a new task.
          </Typography>
          <Typography mt={2}>
            Once the task is created, it can then be opened to edit additional fields like the
            description, status, due date, and if the task is a
            <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key task.
          </Typography>
          <Typography mt={2}>
            <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key tasks, similar to key folders, are
            automatically displayed on the dashboard.
          </Typography>
          <Box mt={2} mb={4}>
            <Alert severity="info">
              <strong>Note: &nbsp;</strong>Before you start manually creating tasks,
              there is a tool to bulk import tasks on the <Link to="/home/tools" component="a">Tools page.</Link>
            </Alert>
          </Box>

          <Divider className='my2' />
          <Box component="h3" mt={0.5} className='flex-ac'>
            <PeopleAltIcon htmlColor='grey' style={{ marginRight: '5px' }} />
            Collaboration
          </Box>
          <Typography mt={2}>
            When you're ready to invite additional user's to your portal,
            whether that be customers or more administrators, this can be done in the engagement settings
            (Settings &rarr; Engagement &rarr; Members).
          </Typography>
          <Typography mt={2}>
            <Link to="/home/settings" component="a">Go to engagement settings &rarr;</Link>
          </Typography>
          <Typography mt={2}>
            From this page, click the
            &nbsp;"<PeopleAltIcon htmlColor='grey' style={{ verticalAlign: 'text-bottom' }} /> Members"
            tab and you will see a button to invite people to the <strong>{engagement.name}</strong> engagement,
            as well as a list of the current admins/members.
          </Typography>
          <Typography mt={2}>
            <strong>Members (non-admins) </strong>&mdash; have <strong>read only</strong> access to the engagement they are invited to.
            They cannot edit any items in the engagement and will have an explicit view of engagement related items only.
          </Typography>
          <Typography mt={0.5} variant='body2'>
            &mdash; Best for customers & clients.
          </Typography>
          <Typography mt={2}>
            <strong>Administrators </strong>&mdash; have complete  access.  They cannot edit any items
            in the engagement and will have an explicit view of engagement related items only.
          </Typography>
          <Typography mt={0.5} variant='body2'>
            &mdash; Best for admins & employees.
          </Typography>
        </Box>
      </DialogContent>
    </Drawer>
  );
};