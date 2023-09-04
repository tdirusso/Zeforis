const { isDev } = require('../config');

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fileUpload = require('express-fileupload');
const { initializeDatabase, pool } = require('../database');
const emailService = require('../email');

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
const slackbotStats = require('./routes/slackbot/stats');
const logFrontendError = require('./routes/logs/logFrontendError');

const checkEngagementAdminMW = require('./middlewares/checkEngagementAdmin');
const checkEngagementMemberMW = require('./middlewares/checkEngagementMember');
const checkOrgOwnerMW = require('./middlewares/checkOrgOwner');
const checkAuthMW = require('./middlewares/checkAuth');
const errorHandlerMW = require('./middlewares/errorHandler');
const checkSlackSignature = require('./middlewares/checkSlackSignature');

const app = express();
const port = process.env.PORT || 8080;

app.set('trust proxy', 1);

if (isDev) {
  const cors = require('cors');

  app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.0.164:3000'],
    credentials: true
  }));
}

app.use(express.static(path.join(__dirname + '/../', 'build')));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  verify: (req, _, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cookieParser());
app.use(fileUpload({}));

const forceSSL = (req, res, next) => {

  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !isDev) {
    return res.redirect(301, 'https://' + req.get('host') + req.url);
  }

  next();
};

app.use(forceSSL);

const authenicatedUserRateLimit = rateLimit({
  windowMs: 60000, // 1 minute
  max: 200, // Limit each IP to 200 requests per 1 minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests... please wait.'
  }
});

const unAuthenicatedUserRateLimit = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // Limit each IP to 20 requests per 1 minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests... please wait.'
  }
});

const boot = async () => {
  await initializeDatabase();

  app.post('/api/users/login', unAuthenicatedUserRateLimit, login);
  app.post('/api/users/authenticate', authenicatedUserRateLimit, authenticate);
  app.get('/api/users/verify', unAuthenicatedUserRateLimit, verify);
  app.post('/api/users/register', unAuthenicatedUserRateLimit, register);
  app.post('/api/users/invite', authenicatedUserRateLimit, checkOrgOwnerMW, inviteEngagementUser);
  app.delete('/api/users/removeEngagementUser', authenicatedUserRateLimit, checkOrgOwnerMW, removeEngagementUser);
  app.delete('/api/removeOrgUser', authenicatedUserRateLimit, checkOrgOwnerMW, removeOrgUser);
  app.patch('/api/users', authenicatedUserRateLimit, checkAuthMW, updateProfile);
  app.patch('/api/users/permissions', authenicatedUserRateLimit, checkOrgOwnerMW, updatePermission);
  app.patch('/api/users/access', authenicatedUserRateLimit, checkOrgOwnerMW, updateAccess);
  app.patch('/api/users/password', unAuthenicatedUserRateLimit, updatePassword);
  app.get('/api/users/invitation', unAuthenicatedUserRateLimit, getInvitationData);
  app.post('/api/users/sendPasswordResetLink', unAuthenicatedUserRateLimit, sendPasswordResetLink);
  app.post('/api/users/resendVerificationLink', unAuthenicatedUserRateLimit, resendVerificationLink);
  app.patch('/api/users/access/batch', authenicatedUserRateLimit, checkOrgOwnerMW, batchUpdateAccess);
  app.patch('/api/users/permissions/batch', authenicatedUserRateLimit, checkOrgOwnerMW, batchUpdatePermission);

  app.post('/api/engagements', authenicatedUserRateLimit, checkOrgOwnerMW, createEngagement);
  app.get('/api/engagements', authenicatedUserRateLimit, checkEngagementMemberMW, getEngagement);
  app.patch('/api/engagements', authenicatedUserRateLimit, checkOrgOwnerMW, updateEngagement);
  app.delete('/api/engagements', authenicatedUserRateLimit, checkOrgOwnerMW, deleteEngagement);
  app.delete('/api/engagements/leave', authenicatedUserRateLimit, checkEngagementMemberMW, leaveEngagement);

  app.post('/api/folders', authenicatedUserRateLimit, checkEngagementAdminMW, createFolder);
  app.delete('/api/folders', authenicatedUserRateLimit, checkEngagementAdminMW, deleteFolder);
  app.patch('/api/folders', authenicatedUserRateLimit, checkEngagementAdminMW, updateFolder);

  app.post('/api/tasks', authenicatedUserRateLimit, checkEngagementAdminMW, createTask);
  app.delete('/api/tasks', authenicatedUserRateLimit, checkEngagementAdminMW, deleteTasks);
  app.patch('/api/tasks', authenicatedUserRateLimit, checkEngagementAdminMW, updateTask);
  app.patch('/api/tasks/batch', authenicatedUserRateLimit, checkEngagementAdminMW, batchUpdateTasks);
  app.post('/api/tasks/import', authenicatedUserRateLimit, checkEngagementAdminMW, importTasks);

  app.post('/api/tags', authenicatedUserRateLimit, checkEngagementAdminMW, createTag);
  app.delete('/api/tags', authenicatedUserRateLimit, checkEngagementAdminMW, deleteTag);
  app.patch('/api/tags', authenicatedUserRateLimit, checkEngagementAdminMW, updateTag);

  app.post('/api/orgs', authenicatedUserRateLimit, checkAuthMW, createOrg);
  app.patch('/api/orgs', authenicatedUserRateLimit, checkOrgOwnerMW, updateOrg);
  app.get('/api/orgs', unAuthenicatedUserRateLimit, getOrg);
  app.delete('/api/orgs', authenicatedUserRateLimit, checkOrgOwnerMW, deleteOrg);
  app.delete('/api/orgs/leave', authenicatedUserRateLimit, checkEngagementMemberMW, leaveOrg);

  app.post('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, createWidget);
  app.patch('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, updatedWidget);
  app.delete('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, deleteWidget);

  app.post('/api/slackbot/stats', checkSlackSignature, slackbotStats);

  app.post('/api/logs/logFrontendError', logFrontendError);

  app.use(errorHandlerMW);

  app.get('*', forceSSL, (_, res) => {
    return res.sendFile(path.join(__dirname + '/../', 'build', 'index.html'));
  });

  app.listen(port, () => console.log('App is running'));

  process.on('uncaughtException', async (error, origin) => {
    const logData = `Origin: ${origin} - ${error.stack}`;

    console.log('Uncaught Exception:  ', logData);

    try {
      if (!isDev) {
        await pool.query(
          'INSERT INTO app_logs (type, data) VALUES ("uncaught-error", ?)',
          [logData]
        );

        await emailService.sendMail({
          from: 'Zeforis',
          to: process.env.MAILER_SUPPORT_EMAIL,
          subject: `Zeforis - Uncaught Error`,
          text: logData,
          html: logData
        });
      }
    } catch (newError) {
      console.log('Error handling uncaughtException:  ', newError);
    } finally {
      process.exit(1);
    }
  });
};

boot();
