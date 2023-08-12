const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const login = require('./routes/users/login');
const authenticate = require('./routes/users/authenticate');
const createEngagement = require('./routes/engagements/createEngagement');
const getEngagement = require('./routes/engagements/getEngagementData');
const createFolder = require('./routes/folders/createFolder');
const updateEngagement = require('./routes/engagements/updateEngagement');
const register = require('./routes/users/register');
const verify = require('./routes/users/verify');
const inviteEngagementUser = require('./routes/users/inviteEngagementUser');
const removeEngagementUser = require('./routes/users/removeEngagementUser');
const updateProfile = require('./routes/users/updateProfile');
const updateFolder = require('./routes/folders/updateFolder');
const createTask = require('./routes/tasks/createTask');
const createTag = require('./routes/tags/createTag');
const createOrg = require('./routes/orgs/createOrg');
const deleteTag = require('./routes/tags/deleteTag');
const deleteTasks = require('./routes/tasks/deleteTasks');
const deleteFolder = require('./routes/folders/deleteFolder');
const deleteEngagement = require('./routes/engagements/deleteEngagement');
const removeOrgUser = require('./routes/users/removeOrgUser');
const updateTask = require('./routes/tasks/updateTask');
const updatePermission = require('./routes/users/updatePermission');
const updateAccess = require('./routes/users/updateAccess');
const updateOrg = require('./routes/orgs/updateOrg');
const batchUpdateTasks = require('./routes/tasks/batchUpdateTasks');
const updateTag = require('./routes/tags/updateTag');
const importTasks = require('./routes/tasks/importTasks');
const createWidget = require('./routes/widgets/createWidget');
const updatedWidget = require('./routes/widgets/updateWidget');
const deleteWidget = require('./routes/widgets/deleteWidget');
const getInvitationData = require('./routes/users/getInvitationData');
const updatePassword = require('./routes/users/updatePassword');
const getOrg = require('./routes/orgs/getOrg');
const sendPasswordResetLink = require('./routes/users/sendPasswordResetLink');
const resendVerificationLink = require('./routes/users/resendVerificationLink');
const deleteOrg = require('./routes/orgs/deleteOrg');
const leaveEngagement = require('./routes/engagements/leaveEngagement');
const leaveOrg = require('./routes/orgs/leaveOrg');
const batchUpdateAccess = require('./routes/users/batchUpdateAccess');
const batchUpdatePermission = require('./routes/users/batchUpdatePermission');

const checkEngagementAdminMW = require('./middlewares/checkEngagementAdmin');
const checkEngagementMemberMW = require('./middlewares/checkEngagementMember');
const checkOrgOwnerMW = require('./middlewares/checkOrgOwner');
const checkAuthMW = require('./middlewares/checkAuth');

const app = express();
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
  const cors = require('cors');

  app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }));
}

app.use(express.static(path.join(__dirname + '/../', 'build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({}));

const boot = async () => {
  app.post('/api/users/login', login);
  app.post('/api/users/authenticate', authenticate);
  app.get('/api/users/verify', verify);
  app.post('/api/users/register', register);
  app.post('/api/users/invite', checkOrgOwnerMW, inviteEngagementUser);
  app.delete('/api/users/removeEngagementUser', checkOrgOwnerMW, removeEngagementUser);
  app.delete('/api/removeOrgUser', checkOrgOwnerMW, removeOrgUser);
  app.patch('/api/users', checkAuthMW, updateProfile);
  app.patch('/api/users/permissions', checkOrgOwnerMW, updatePermission);
  app.patch('/api/users/access', checkOrgOwnerMW, updateAccess);
  app.patch('/api/users/password', updatePassword);
  app.get('/api/users/invitation', getInvitationData);
  app.post('/api/users/sendPasswordResetLink', sendPasswordResetLink);
  app.post('/api/users/resendVerificationLink', resendVerificationLink);
  app.patch('/api/users/access/batch', checkOrgOwnerMW, batchUpdateAccess);
  app.patch('/api/users/permissions/batch', checkOrgOwnerMW, batchUpdatePermission);

  app.post('/api/engagements', checkOrgOwnerMW, createEngagement);
  app.get('/api/engagements', checkEngagementMemberMW, getEngagement);
  app.patch('/api/engagements', checkOrgOwnerMW, updateEngagement);
  app.delete('/api/engagements', checkOrgOwnerMW, deleteEngagement);
  app.delete('/api/engagements/leave', checkEngagementMemberMW, leaveEngagement);

  app.post('/api/folders', checkEngagementAdminMW, createFolder);
  app.delete('/api/folders', checkEngagementAdminMW, deleteFolder);
  app.patch('/api/folders', checkEngagementAdminMW, updateFolder);

  app.post('/api/tasks', checkEngagementAdminMW, createTask);
  app.delete('/api/tasks', checkEngagementAdminMW, deleteTasks);
  app.patch('/api/tasks', checkEngagementAdminMW, updateTask);
  app.patch('/api/tasks/batch', checkEngagementAdminMW, batchUpdateTasks);
  app.post('/api/tasks/import', checkEngagementAdminMW, importTasks);

  app.post('/api/tags', checkEngagementAdminMW, createTag);
  app.delete('/api/tags', checkEngagementAdminMW, deleteTag);
  app.patch('/api/tags', checkEngagementAdminMW, updateTag);

  app.post('/api/orgs', checkAuthMW, createOrg);
  app.patch('/api/orgs', checkOrgOwnerMW, updateOrg);
  app.get('/api/orgs', getOrg);
  app.delete('/api/orgs', checkOrgOwnerMW, deleteOrg);
  app.delete('/api/orgs/leave', checkEngagementMemberMW, leaveOrg);

  app.post('/api/widgets', checkEngagementAdminMW, createWidget);
  app.patch('/api/widgets', checkEngagementAdminMW, updatedWidget);
  app.delete('/api/widgets', checkEngagementAdminMW, deleteWidget);

  app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../', 'build', 'index.html')));
  app.listen(port, () => console.log('App is running'));
};

boot();