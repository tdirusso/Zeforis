const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const login = require('./routes/login');
const authenticate = require('./routes/authenticate');
const addClient = require('./routes/addClient');
const getClientData = require('./routes/getClientData');
const addFolder = require('./routes/addFolder');
const updateClient = require('./routes/updateClient');
const register = require('./routes/register');
const verify = require('./routes/verify');
const inviteClientMember = require('./routes/inviteClientMember');
const completeRegistration = require('./routes/completeRegistration');
const removeClientMember = require('./routes/removeClientMember');
const updateProfile = require('./routes/updateProfile');
const updateFolder = require('./routes/updateFolder');
const addTask = require('./routes/addTask');
const addTags = require('./routes/addTags');
const removeTag = require('./routes/removeTag');
const removeTasks = require('./routes/removeTasks');
const removeFolder = require('./routes/removeFolder');
const updateTask = require('./routes/updateTask');
const bulkUpdateTasks = require('./routes/bulkUpdateTasks');

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
  app.post('/api/login', login);
  app.post('/api/authenticate', authenticate);
  app.post('/api/addClient', checkPermissionsMW, addClient);
  app.get('/api/getClientData', checkPermissionsMW, getClientData);
  app.get('/api/verify', verify);
  app.post('/api/addFolder', checkPermissionsMW, addFolder);
  app.post('/api/register', register);
  app.post('/api/inviteClientMember', checkPermissionsMW, inviteClientMember);
  app.patch('/api/updateClient', checkPermissionsMW, updateClient);
  app.post('/api/completeRegistration', completeRegistration);
  app.post('/api/addTask', checkPermissionsMW, addTask);
  app.post('/api/addTags', checkPermissionsMW, addTags);
  app.delete('/api/removeClientMember', checkPermissionsMW, removeClientMember);
  app.delete('/api/removeTag', checkPermissionsMW, removeTag);
  app.delete('/api/removeTasks', checkPermissionsMW, removeTasks);
  app.delete('/api/removeFolder', checkPermissionsMW, removeFolder);
  app.patch('/api/updateProfile', checkAuth, updateProfile);
  app.patch('/api/updateTask', checkPermissionsMW, updateTask);
  app.patch('/api/bulkUpdateTasks', checkPermissionsMW, bulkUpdateTasks);
  app.patch('/api/updateFolder', checkPermissionsMW, updateFolder);

  app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../', 'build', 'index.html')));
  app.listen(port, () => console.log('App is running'));
};

boot();