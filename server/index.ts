import { isDev } from './config';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fileUpload from 'express-fileupload';
import { initializeDatabase, pool } from './database';
import emailService from './email';
import slackbot from './slackbot';
import login from './routes/auth/login';
import authenticate from './routes/auth/authenticate';
import createEngagement from './routes/engagements/createEngagement';
import getEngagement from './routes/engagements/getEngagementData';
import createFolder from './routes/folders/createFolder';
import updateEngagement from './routes/engagements/updateEngagement';
import register from './routes/users/register';
import verify from './routes/users/verify';
import inviteOrgUsers from './routes/orgs/inviteOrgUsers';
import removeEngagementUser from './routes/engagements/removeEngagementUser';
import updateUser from './routes/users/updateUser';
import updateFolder from './routes/folders/updateFolder';
import createTask from './routes/tasks/createTask';
import createTag from './routes/tags/createTag';
import createOrg from './routes/orgs/createOrg';
import deleteTag from './routes/tags/deleteTag';
import deleteTasks from './routes/tasks/deleteTasks';
import deleteFolder from './routes/folders/deleteFolder';
import deleteEngagement from './routes/engagements/deleteEngagement';
import removeOrgUser from './routes/orgs/removeOrgUser';
import updateTask from './routes/tasks/updateTask';
import updateUserPermissions from './routes/engagements/updateUserPermissions';
import updateAccess from './routes/users/updateAccess';
import updateOrg from './routes/orgs/updateOrg';
import batchUpdateTasks from './routes/tasks/batchUpdateTasks';
import updateTag from './routes/tags/updateTag';
import importTasks from './routes/tasks/importTasks';
import createWidget from './routes/widgets/createWidget';
import updatedWidget from './routes/widgets/updateWidget';
import deleteWidget from './routes/widgets/deleteWidget';
import getInvitationData from './routes/users/getInvitationData';
import updatePassword from './routes/users/updatePassword';
import getOrg from './routes/orgs/getOrg';
import sendPasswordResetLink from './routes/users/sendPasswordResetLink';
import resendVerificationLink from './routes/users/resendVerificationLink';
import deleteOrg from './routes/orgs/deleteOrg';
import leaveEngagement from './routes/engagements/leaveEngagement';
import leaveOrg from './routes/orgs/leaveOrg';
import batchUpdatePermission from './routes/users/batchUpdatePermission';
import slackbotStats from './routes/slackbot/stats';
import logFrontendError from './routes/logs/logFrontendError';
import stripe_createSubscription from './routes/stripe/createSubscription';
import dumpCache from './routes/cache/dumpCache';
import clearCache from './routes/cache/clearCache';
import closeAccount from './routes/users/closeAccount';

import checkEngagementAdminMW from './middlewares/checkEngagementAdmin';
import checkEngagementMemberMW from './middlewares/checkEngagementMember';
import checkOrgOwnerMW from './middlewares/checkOrgOwner';
import checkAuthMW from './middlewares/checkAuth';
import errorHandlerMW from './middlewares/errorHandler';
import checkSlackSignature from './middlewares/checkSlackSignature';

import stripeWebhook from './webhooks/stripe';

declare module 'http' {
  interface IncomingMessage {
    rawBody: Buffer;
  }
}

const app = express();
const port = process.env.PORT || 8080;

app.set('trust proxy', 1);

if (isDev) {
  const cors = require('cors');

  app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.0.164:3000', 'http://localhost:8080', 'http://192.168.1.27:3000'],
    credentials: true
  }));
}

app.use(express.static(path.join(__dirname + '/../', 'build-client')));
app.use(express.urlencoded({
  extended: true,
  verify: (req, _, buf) => {
    req.rawBody = buf;
  }
}));
app.use(cookieParser());
app.use(fileUpload({}));

const forceSSL = (req: Request, res: Response, next: NextFunction) => {
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

  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

  app.use(express.json());

  app.post('/api/login', unAuthenicatedUserRateLimit, login);
  app.post('/api/authenticate', authenicatedUserRateLimit, authenticate);
  app.post('/api/register', unAuthenicatedUserRateLimit, register);

  app.get('/api/users/:userId/verify', unAuthenicatedUserRateLimit, verify);
  app.patch('/api/users/:userId', authenicatedUserRateLimit, checkAuthMW, updateUser);

  app.patch('/api/users/password', unAuthenicatedUserRateLimit, updatePassword);

  app.get('/api/users/invitation', unAuthenicatedUserRateLimit, getInvitationData);
  app.post('/api/users/sendPasswordResetLink', unAuthenicatedUserRateLimit, sendPasswordResetLink);
  app.post('/api/users/resendVerificationLink', unAuthenicatedUserRateLimit, resendVerificationLink);
  app.patch('/api/users/permissions/batch', authenicatedUserRateLimit, checkOrgOwnerMW, batchUpdatePermission);
  app.delete('/api/users', authenicatedUserRateLimit, checkAuthMW, closeAccount);

  app.post('/api/stripe/subscriptions', authenicatedUserRateLimit, checkOrgOwnerMW, stripe_createSubscription);

  app.delete('/api/engagements/:engagementId/users/:userId', authenicatedUserRateLimit, checkOrgOwnerMW, removeEngagementUser);
  app.patch('/api/engagements/:engagementId/users/:userId/permissions', authenicatedUserRateLimit, checkOrgOwnerMW, updateUserPermissions);
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

  app.delete('/api/orgs/:orgId/users/:userId', authenicatedUserRateLimit, checkOrgOwnerMW, removeOrgUser);
  app.patch('/api/orgs/:orgId/users/:userId/access', authenicatedUserRateLimit, checkOrgOwnerMW, updateAccess);
  app.post('/api/orgs/:orgId/invite', authenicatedUserRateLimit, checkOrgOwnerMW, inviteOrgUsers);
  app.post('/api/orgs', authenicatedUserRateLimit, checkAuthMW, createOrg);
  app.patch('/api/orgs', authenicatedUserRateLimit, checkOrgOwnerMW, updateOrg);
  app.get('/api/orgs', unAuthenicatedUserRateLimit, getOrg);
  app.delete('/api/orgs', authenicatedUserRateLimit, checkOrgOwnerMW, deleteOrg);
  app.delete('/api/orgs/leave', authenicatedUserRateLimit, checkEngagementMemberMW, leaveOrg);

  app.post('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, createWidget);
  app.patch('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, updatedWidget);
  app.delete('/api/widgets', authenicatedUserRateLimit, checkEngagementAdminMW, deleteWidget);

  app.get('/api/cache', dumpCache);
  app.delete('/api/cache', clearCache);

  app.post('/api/slackbot/stats', checkSlackSignature, slackbotStats);

  app.post('/api/logs/logFrontendError', logFrontendError);

  app.use(errorHandlerMW);

  app.get('*', forceSSL, (_, res) => {
    return res.sendFile(path.join(__dirname + '/../', 'build-client', 'index.html'));
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

        await emailService.sendEmail({
          from: emailService.senders?.info,
          to: emailService.senders?.error,
          subject: `Zeforis - Uncaught Error`,
          text: logData,
          html: logData
        });

        await slackbot.post({
          channel: slackbot.channels?.errors,
          message: `*FATAL Uncaught Server Error*\n${logData}`
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
