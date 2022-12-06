const express = require('express');
const cookieParser = require('cookie-parser');
const Mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

const addUser = require('./routes/addUser');
const login = require('./routes/login');
const authenticate = require('./routes/authenticate');
const addLink = require('./routes/addLink');
const addClient = require('./routes/addClient');
const getAllClients = require('./routes/getAllClients');
const getClientTree = require('./routes/getClientTree');
const addFolder = require('./routes/addFolder');
const updateClient = require('./routes/updateClient');

const checkPermissionsMiddleware = require('./middlewares/checkPermissions');

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

const boot = async () => {
  const dbUsername = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbCluster = process.env.DB_CLUSTER;
  const dbName = process.env.DB_NAME;

  const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbCluster}/${dbName}`;

  await Mongoose.connect(dbUri);

  app.post('/api/addUser', checkPermissionsMiddleware, addUser);
  app.post('/api/login', login);
  app.post('/api/authenticate', authenticate);
  app.post('/api/addLink', checkPermissionsMiddleware, addLink);
  app.post('/api/addClient', checkPermissionsMiddleware, addClient);
  app.get('/api/getAllClients', checkPermissionsMiddleware, getAllClients);
  app.get('/api/getClientTree', checkPermissionsMiddleware, getClientTree);
  app.post('/api/addFolder', checkPermissionsMiddleware, addFolder);
  app.patch('/api/updateClient', checkPermissionsMiddleware, updateClient);

  app.get('*', (_, res) => res.sendFile(path.join(__dirname + '/../', 'build', 'index.html')));
  app.listen(port, () => console.log('App is running'));
}

boot();