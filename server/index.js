const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const login = require('./routes/users/login');
const authenticate = require('./routes/users/authenticate');
const addClient = require('./routes/clients/addClient');
const getClient = require('./routes/clients/getClientData');
const createFolder = require('./routes/folders/createFolder');
const updateClient = require('./routes/clients/updateClient');
const register = require('./routes/users/register');
const verify = require('./routes/users/verify');
const inviteClientUser = require('./routes/users/inviteClientUser');
const completeRegistration = require('./routes/users/completeRegistration');
const removeClientUser = require('./routes/users/removeClientUser');
const updateProfile = require('./routes/users/updateProfile');
const updateFolder = require('./routes/folders/updateFolder');
const createTask = require('./routes/tasks/createTask');
const createTag = require('./routes/tags/createTag');
const addOrg = require('./routes/orgs/addOrg');
const removeTag = require('./routes/tags/removeTag');
const deleteTasks = require('./routes/tasks/deleteTasks');
const removeFolder = require('./routes/folders/removeFolder');
const removeClient = require('./routes/clients/removeClient');
const removeUser = require('./routes/users/removeUser');
const updateTask = require('./routes/tasks/updateTask');
const updatePermission = require('./routes/users/updatePermission');
const updateAccess = require('./routes/users/updateAccess');
const updateOrg = require('./routes/orgs/updateOrg');
const bulkUpdateTasks = require('./routes/tasks/bulkUpdateTasks');
const updateTag = require('./routes/tags/updateTag');

const checkPermissionsMW = require('./middlewares/checkPermissions');
const checkAuth = require('./middlewares/checkAuth');

const app = express();
const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
  const cors = require('cors');

  app.use(cors({
    origin: (origin, callback) => {
      const domainRegex = new RegExp(/http:\/\/.*.localhost:3000/);

      if (domainRegex.test(origin) || origin === 'http://localhost:3000') {
        callback(null, true);
      }
    },
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
  app.post('/api/users/completeRegistration', completeRegistration);
  app.delete('/api/users/uninvite', checkPermissionsMW, removeClientUser);
  app.delete('/api/users', checkPermissionsMW, removeUser);
  app.patch('/api/users', checkAuth, updateProfile);
  app.patch('/api/users/permissions', checkPermissionsMW, updatePermission);
  app.patch('/api/users/access', checkPermissionsMW, updateAccess);

  app.post('/api/clients', checkPermissionsMW, addClient);
  app.get('/api/clients', checkAuth, getClient);
  app.patch('/api/clients', checkPermissionsMW, updateClient);
  app.delete('/api/clients', checkPermissionsMW, removeClient);

  app.post('/api/folders', checkPermissionsMW, createFolder);
  app.delete('/api/folders', checkPermissionsMW, removeFolder);
  app.patch('/api/folders', checkPermissionsMW, updateFolder);

  app.post('/api/tasks', checkPermissionsMW, createTask);
  app.delete('/api/tasks', checkPermissionsMW, deleteTasks);
  app.patch('/api/tasks', checkPermissionsMW, updateTask);
  app.patch('/api/tasks/batch', checkPermissionsMW, bulkUpdateTasks);

  app.post('/api/tags', checkPermissionsMW, createTag);
  app.delete('/api/tags', checkPermissionsMW, removeTag);
  app.patch('/api/tags', checkPermissionsMW, updateTag);

  app.post('/api/orgs', addOrg);
  app.patch('/api/orgs', checkPermissionsMW, updateOrg);

  app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../', 'build', 'index.html')));
  app.listen(port, () => console.log('App is running'));
};

boot();