import DialogContent from '@mui/material/DialogContent';
import {
  Alert,
  Box,
  Button,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Paper,
  TextField,
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

export default function GettingStartedDrawer(props) {
  const {
    isOpen,
    close,
    org,
    engagement,
    isAdmin
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
        className: 'drawer'
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
        {
          isAdmin ?
            <AdminGettingStartedDrawer close={close} org={org} engagement={engagement} /> :
            <MemberGettingStartedDrawer close={close} org={org} />
        }
      </DialogContent>
    </Drawer>
  );
}



function MemberGettingStartedDrawer(props) {
  const {
    close,
    org
  } = props;

  return (
    <>
      <Box component="h3">
        Welcome to the {org.name} Portal.
      </Box>
      <Box component="h4" mt={1.5}>
        Powered by Zeforis.
      </Box>
      <Divider style={{ marginTop: '2rem', marginBottom: '1rem' }} />
      <Typography mt={2}>
        We're excited to help you get started as a member of this engagement.
        We'll walk you through the basics, making the most of your engagement with {org.name} and collaborating effectively with the team.
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
        Start by familiarizing yourself with the concept of folders.
      </Typography>
      <Typography mt={2}>
        Folders are used to organize tasks efficiently. Every task belongs to a specific folder.
      </Typography>
      <Typography mt={2}>
        <Link to="/home/folders" component="a">Go to folders &rarr;</Link>
      </Typography>
      <Typography mt={2}>
        From this page, you can explore existing folders and view tasks within each folder.
      </Typography>
      <Typography mt={2}>
        You'll notice there is a section for
        <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key folders, as well as Other folders.
      </Typography>
      <Typography mt={2}>
        <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key folders help prioritize tasks.
        They appear on the dashboard, displaying up to 5 essential tasks within that specific folder. You can quickly access these tasks
        from the dashboard and open their URL links directly, if applicable.
      </Typography>

      <Divider className='my2' />
      <Box component="h3" mt={0.5} className='flex-ac'>
        <TaskAltIcon htmlColor='grey' style={{ marginRight: '5px' }} />
        Tasks
      </Box>
      <Typography mt={2}>
        <Link to="/home/tasks" component="a">Go to tasks &rarr;</Link>
      </Typography>
      <Typography mt={2}>
        From the tasks page, you can view all of the current tasks for your engagement with {org.name}.
      </Typography>
      <Typography mt={2}>
        Tasks contain details like:
      </Typography>
      <Box mt={2}>
        <ul>
          <li>
            <Typography>
              Task name
            </Typography>
          </li>
          <li>
            <Typography>
              Folder
            </Typography>
          </li>
          <li>
            <Typography>Status</Typography>
          </li>
          <li>
            <Typography>Description</Typography>
          </li>
          <li>
            <Typography>Due Date</Typography>
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
        <StarIcon htmlColor='gold' style={{ verticalAlign: 'text-bottom' }} />Key tasks, similar to key folders, are
        automatically displayed on the dashboard.
      </Typography>

      <Divider className='my2' />
      <Box component="h3" mt={0.5} className='flex-ac'>
        <GridViewRoundedIcon htmlColor='grey' style={{ marginRight: '5px' }} />
        Dashboard
      </Box>
      <Typography mt={2}>
        Now that you're familiar with folders and tasks, let's head back to the dashboard.
      </Typography>
      <Typography mt={2}>
        <Link to="/home/dashboard" component="a">Go to dashboard &rarr;</Link>
      </Typography>
      <Typography mt={2}>
        The dashboard gives you a general overview of the engagement, including key tasks, key folders,
        upcoming tasks (based on due date), task metrics, and more.
      </Typography>

      <Divider className='my2' />
      <Box component="h3" mt={0.5} className='flex-ac'>
        <VerifiedIcon htmlColor='mediumseagreen' style={{ marginRight: '5px' }} />
        Finishing Up
      </Box>
      <Typography mt={2}>
        Any questions and feedback are always welcome and appreciated, just send us an email
        at <a href="mailto:info@zeforis.com">info@zeforis.com</a>.
      </Typography>
      <Box mt={3}>
        <Button
          startIcon={<RocketLaunchIcon />}
          onClick={close}
          variant='contained'>
          Let's go!
        </Button>
      </Box>
    </>
  );
}






function AdminGettingStartedDrawer(props) {
  const {
    close,
    org,
    engagement
  } = props;

  const customLoginPageUrl = `${process.env.REACT_APP_APP_DOMAIN}/login?cp=${window.btoa(`orgId=${org.id}`)}`;

  return (
    <>
      <Box component="h3">
        Welcome to the {org.name} Portal.
      </Box>
      <Box component="h4" mt={1.5}>
        Powered by Zeforis.
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
      <Divider className='my2' />
      <Box component="h3" mt={0.5} className='flex-ac'>
        <AutoAwesomeIcon htmlColor='grey' style={{ marginRight: '5px' }} />
        Customization
      </Box>
      <Box component="h4" mt={3}>
        Branding
      </Box>
      <Typography mt={1}>
        You can apply your own custom branding to the {org.name} org, including color, logo, and a custom login page just for your org.
      </Typography>
      <Typography mt={2}>
        Anyone who logs in to view or work on engagements in {org.name} will also see your branding.
      </Typography>
      <Typography mt={2}>
        These customizations can be done from Settings &rarr; Organization &rarr; Branding.
      </Typography>
      <Typography mt={2}>
        <Link to="/home/settings?tab=1" component="a">Go to branding settings &rarr;</Link>
      </Typography>
      <Typography mt={2}>
        The "Custom Login Page" feature provides your customers with a custom login experience by incorporating your branding into the login page, delivering a professional touch while
        enhancing your brand, customer retention, marketing opportunities, and overall user experience.
      </Typography>
      <Box mt={2}>
        <Button
          startIcon={<OpenInNewIcon />}
          onClick={() => window.open(customLoginPageUrl, '_blank')}
          variant='contained'>
          Open custom login page
        </Button>
      </Box>
      <Typography mt={2}>
        The URL link for the custom login page can always be found in the organization settings.
      </Typography>
      <Box component="h4" mt={3}>
        Widgets
      </Box>
      <Typography mt={1}>
        You can create custom widgets that will display on the dashboard from the <Link to="/home/tools" component="a">Tools page</Link> (Tools &rarr; Widgets).
      </Typography>
      <Typography mt={2}>
        These widgets are great for things like announcements, general messages, etc.  You can
        customize titles, content, and color.
      </Typography>
      <Box mt={3} mb={4}>
        <Paper style={{
          minHeight: '250px',
        }}>
          <Box
            component="h5"
            mb={1}>This is an example widget
          </Box>
          <TextField
            className="readonly-textfield"
            fullWidth
            inputProps={{
              style: {
                fontWeight: 400,
                fontSize: '0.875rem'
              }
            }}
            InputProps={{ readOnly: true }}
            variant="standard"
            value={
              `Meeting Schedule:
-  Wed. Jan. 1st, 2:30pm
-  Thur. Jan 3rd, 12:30pm

Announcements
-  ${org.name} is awesome!
`
            }
            multiline>
          </TextField>
        </Paper>
      </Box>
      <Divider className='my2' />
      <Box component="h3" mt={0.5} className='flex-ac'>
        <VerifiedIcon htmlColor='mediumseagreen' style={{ marginRight: '5px' }} />
        Finishing Up
      </Box>
      <Typography mt={2}>
        The platform offers other tools and capabilities like analytics, custom report generation, data exporting, and more.
      </Typography>
      <Typography mt={2}>
        Any questions and feedback are always welcome and appreciated, just send us an email
        at <a href="mailto:info@zeforis.com">info@zeforis.com</a>.
      </Typography>
      <Box mt={3}>
        <Button
          startIcon={<RocketLaunchIcon />}
          onClick={close}
          variant='contained'>
          Let's go!
        </Button>
      </Box>
    </>
  );
};