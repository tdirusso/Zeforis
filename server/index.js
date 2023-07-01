const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const login = require('./routes/users/login');
const authenticate = require('./routes/users/authenticate');
const createClient = require('./routes/clients/createClient');
const getClient = require('./routes/clients/getClientData');
const createFolder = require('./routes/folders/createFolder');
const updateClient = require('./routes/clients/updateClient');
const register = require('./routes/users/register');
const verify = require('./routes/users/verify');
const inviteClientUser = require('./routes/users/inviteClientUser');
const removeClientUser = require('./routes/users/removeClientUser');
const updateProfile = require('./routes/users/updateProfile');
const updateFolder = require('./routes/folders/updateFolder');
const createTask = require('./routes/tasks/createTask');
const createTag = require('./routes/tags/createTag');
const createOrg = require('./routes/orgs/createOrg');
const deleteTag = require('./routes/tags/deleteTag');
const deleteTasks = require('./routes/tasks/deleteTasks');
const deleteFolder = require('./routes/folders/deleteFolder');
const deleteClient = require('./routes/clients/deleteClient');
const removeUser = require('./routes/users/removeUser');
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

const checkPermissionsMW = require('./middlewares/checkPermissions');
const checkAuth = require('./middlewares/checkAuth');

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
  app.post('/api/users/invite', checkPermissionsMW, inviteClientUser);
  app.delete('/api/users/uninvite', checkPermissionsMW, removeClientUser);
  app.delete('/api/users', checkPermissionsMW, removeUser);
  app.patch('/api/users', checkAuth, updateProfile);
  app.patch('/api/users/permissions', checkPermissionsMW, updatePermission);
  app.patch('/api/users/access', checkPermissionsMW, updateAccess);
  app.patch('/api/users/password', updatePassword);
  app.get('/api/users/invitation', getInvitationData);

  app.post('/api/clients', checkPermissionsMW, createClient);
  app.get('/api/clients', checkAuth, getClient);
  app.patch('/api/clients', checkPermissionsMW, updateClient);
  app.delete('/api/clients', checkPermissionsMW, deleteClient);

  app.post('/api/folders', checkPermissionsMW, createFolder);
  app.delete('/api/folders', checkPermissionsMW, deleteFolder);
  app.patch('/api/folders', checkPermissionsMW, updateFolder);

  app.post('/api/tasks', checkPermissionsMW, createTask);
  app.delete('/api/tasks', checkPermissionsMW, deleteTasks);
  app.patch('/api/tasks', checkPermissionsMW, updateTask);
  app.patch('/api/tasks/batch', checkPermissionsMW, batchUpdateTasks);
  app.post('/api/tasks/import', checkPermissionsMW, importTasks);

  app.post('/api/tags', checkPermissionsMW, createTag);
  app.delete('/api/tags', checkPermissionsMW, deleteTag);
  app.patch('/api/tags', checkPermissionsMW, updateTag);

  app.post('/api/orgs', createOrg);
  app.patch('/api/orgs', checkPermissionsMW, updateOrg);

  app.post('/api/widgets', checkPermissionsMW, createWidget);
  app.patch('/api/widgets', checkPermissionsMW, updatedWidget);
  app.delete('/api/widgets', checkPermissionsMW, deleteWidget);

  app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../', 'build', 'index.html')));
  app.listen(port, () => console.log('App is running'));
};

boot();