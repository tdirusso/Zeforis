"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const database_1 = require("./database");
const email_1 = __importDefault(require("./email"));
const slackbot_1 = __importDefault(require("./slackbot"));
const login_1 = __importDefault(require("./routes/auth/login"));
const createEngagement_1 = __importDefault(require("./routes/engagements/createEngagement"));
const createFolder_1 = __importDefault(require("./routes/folders/createFolder"));
const updateEngagement_1 = __importDefault(require("./routes/engagements/updateEngagement"));
const register_1 = __importDefault(require("./routes/users/register"));
const inviteOrgUsers_1 = __importDefault(require("./routes/orgs/inviteOrgUsers"));
const removeEngagementUser_1 = __importDefault(require("./routes/engagements/removeEngagementUser"));
const updateUser_1 = __importDefault(require("./routes/users/updateUser"));
const updateFolder_1 = __importDefault(require("./routes/folders/updateFolder"));
const createTask_1 = __importDefault(require("./routes/tasks/createTask"));
const createTag_1 = __importDefault(require("./routes/tags/createTag"));
const createOrg_1 = __importDefault(require("./routes/orgs/createOrg"));
const deleteTag_1 = __importDefault(require("./routes/tags/deleteTag"));
const deleteTasks_1 = __importDefault(require("./routes/tasks/deleteTasks"));
const deleteFolder_1 = __importDefault(require("./routes/folders/deleteFolder"));
const deleteEngagement_1 = __importDefault(require("./routes/engagements/deleteEngagement"));
const removeOrgUser_1 = __importDefault(require("./routes/orgs/removeOrgUser"));
const updateTask_1 = __importDefault(require("./routes/tasks/updateTask"));
const updateUserPermissions_1 = __importDefault(require("./routes/engagements/updateUserPermissions"));
const updateAccess_1 = __importDefault(require("./routes/users/updateAccess"));
const updateOrg_1 = __importDefault(require("./routes/orgs/updateOrg"));
const batchUpdateTasks_1 = __importDefault(require("./routes/tasks/batchUpdateTasks"));
const updateTag_1 = __importDefault(require("./routes/tags/updateTag"));
const importTasks_1 = __importDefault(require("./routes/tasks/importTasks"));
const createWidget_1 = __importDefault(require("./routes/widgets/createWidget"));
const updateWidget_1 = __importDefault(require("./routes/widgets/updateWidget"));
const deleteWidget_1 = __importDefault(require("./routes/widgets/deleteWidget"));
const getInvitationData_1 = __importDefault(require("./routes/users/getInvitationData"));
const getOrg_1 = __importDefault(require("./routes/orgs/getOrg"));
const deleteOrg_1 = __importDefault(require("./routes/orgs/deleteOrg"));
const leaveEngagement_1 = __importDefault(require("./routes/engagements/leaveEngagement"));
const leaveOrg_1 = __importDefault(require("./routes/orgs/leaveOrg"));
const batchUpdatePermission_1 = __importDefault(require("./routes/users/batchUpdatePermission"));
const stats_1 = __importDefault(require("./routes/slackbot/stats"));
const logFrontendError_1 = __importDefault(require("./routes/logs/logFrontendError"));
const createSubscription_1 = __importDefault(require("./routes/stripe/createSubscription"));
const dumpCache_1 = __importDefault(require("./routes/cache/dumpCache"));
const clearCache_1 = __importDefault(require("./routes/cache/clearCache"));
const closeAccount_1 = __importDefault(require("./routes/users/closeAccount"));
const logout_1 = __importDefault(require("./routes/auth/logout"));
const getEngagementsForOrg_1 = __importDefault(require("./routes/engagements/getEngagementsForOrg"));
const getEngagement_1 = __importDefault(require("./routes/engagements/getEngagement"));
const checkEngagementAdmin_1 = __importDefault(require("./middlewares/checkEngagementAdmin"));
const checkEngagementMember_1 = __importDefault(require("./middlewares/checkEngagementMember"));
const checkOrgOwner_1 = __importDefault(require("./middlewares/checkOrgOwner"));
const checkAuth_1 = __importDefault(require("./middlewares/checkAuth"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const checkSlackSignature_1 = __importDefault(require("./middlewares/checkSlackSignature"));
const verifyLogin_1 = __importDefault(require("./routes/auth/verifyLogin"));
const stripe_1 = __importDefault(require("./webhooks/stripe"));
require("express-async-errors");
const getMe_1 = __importDefault(require("./routes/users/getMe"));
const createInvitations_1 = __importDefault(require("./routes/invitations/createInvitations"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.set('trust proxy', 1);
if (config_1.isDev) {
    const cors = require('cors');
    app.use(cors({
        origin: [
            // 'http://localhost:3000',
            // 'http://192.168.0.164:3000',
            // 'http://localhost:8080',
            'http://127.0.0.1:3000'
        ],
        credentials: true
    }));
}
app.use(express_1.default.static(path_1.default.join(__dirname + '/../', 'build-client')));
app.use(express_1.default.urlencoded({
    extended: true,
    verify: (req, _, buf) => {
        req.rawBody = buf;
    }
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({}));
const forceSSL = (req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !config_1.isDev) {
        return res.redirect(301, 'https://' + req.get('host') + req.url);
    }
    next();
};
app.use(forceSSL);
const authenicatedUserRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many requests... please wait.'
    }
});
const unAuthenicatedUserRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 60000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: 'Too many requests... please wait.'
    }
});
const boot = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.initializeDatabase)();
    app.post('/api/webhooks/stripe', express_1.default.raw({ type: 'application/json' }), stripe_1.default);
    app.use(express_1.default.json());
    app.post('/api/login', unAuthenicatedUserRateLimit, login_1.default);
    app.delete('/api/logout', unAuthenicatedUserRateLimit, logout_1.default);
    app.post('/api/verify-login', unAuthenicatedUserRateLimit, verifyLogin_1.default);
    app.post('/api/users/register', unAuthenicatedUserRateLimit, register_1.default);
    app.get('/api/users/me', checkAuth_1.default, getMe_1.default);
    app.patch('/api/users/:userId', authenicatedUserRateLimit, checkAuth_1.default, updateUser_1.default);
    app.post('/api/engagements/:engagementId/invitations', checkOrgOwner_1.default, createInvitations_1.default);
    app.get('/api/users/invitation', unAuthenicatedUserRateLimit, getInvitationData_1.default);
    app.patch('/api/users/permissions/batch', authenicatedUserRateLimit, checkOrgOwner_1.default, batchUpdatePermission_1.default);
    app.delete('/api/users', authenicatedUserRateLimit, checkAuth_1.default, closeAccount_1.default);
    app.post('/api/stripe/subscriptions', authenicatedUserRateLimit, checkOrgOwner_1.default, createSubscription_1.default);
    app.delete('/api/engagements/:engagementId/users/:userId', authenicatedUserRateLimit, checkOrgOwner_1.default, removeEngagementUser_1.default);
    app.patch('/api/engagements/:engagementId/users/:userId/permissions', authenicatedUserRateLimit, checkOrgOwner_1.default, updateUserPermissions_1.default);
    app.post('/api/engagements', authenicatedUserRateLimit, checkOrgOwner_1.default, createEngagement_1.default);
    app.get('/api/engagements/:engagementId', authenicatedUserRateLimit, checkEngagementMember_1.default, getEngagement_1.default);
    app.patch('/api/engagements/:engagementId', authenicatedUserRateLimit, checkOrgOwner_1.default, updateEngagement_1.default);
    app.delete('/api/engagements', authenicatedUserRateLimit, checkOrgOwner_1.default, deleteEngagement_1.default);
    app.delete('/api/engagements/leave', authenicatedUserRateLimit, checkEngagementMember_1.default, leaveEngagement_1.default);
    app.post('/api/folders', authenicatedUserRateLimit, checkEngagementAdmin_1.default, createFolder_1.default);
    app.delete('/api/folders', authenicatedUserRateLimit, checkEngagementAdmin_1.default, deleteFolder_1.default);
    app.patch('/api/folders', authenicatedUserRateLimit, checkEngagementAdmin_1.default, updateFolder_1.default);
    app.post('/api/tasks', authenicatedUserRateLimit, checkEngagementAdmin_1.default, createTask_1.default);
    app.delete('/api/tasks', authenicatedUserRateLimit, checkEngagementAdmin_1.default, deleteTasks_1.default);
    app.patch('/api/tasks', authenicatedUserRateLimit, checkEngagementAdmin_1.default, updateTask_1.default);
    app.patch('/api/tasks/batch', authenicatedUserRateLimit, checkEngagementAdmin_1.default, batchUpdateTasks_1.default);
    app.post('/api/tasks/import', authenicatedUserRateLimit, checkEngagementAdmin_1.default, importTasks_1.default);
    app.post('/api/tags', authenicatedUserRateLimit, checkEngagementAdmin_1.default, createTag_1.default);
    app.delete('/api/tags', authenicatedUserRateLimit, checkEngagementAdmin_1.default, deleteTag_1.default);
    app.patch('/api/tags', authenicatedUserRateLimit, checkEngagementAdmin_1.default, updateTag_1.default);
    app.get('/api/orgs/:orgId/engagements', checkAuth_1.default, getEngagementsForOrg_1.default);
    app.delete('/api/orgs/:orgId/users/:userId', authenicatedUserRateLimit, checkOrgOwner_1.default, removeOrgUser_1.default);
    app.patch('/api/orgs/:orgId/users/:userId/access', authenicatedUserRateLimit, checkOrgOwner_1.default, updateAccess_1.default);
    app.post('/api/orgs/:orgId/invite', authenicatedUserRateLimit, checkOrgOwner_1.default, inviteOrgUsers_1.default);
    app.post('/api/orgs', authenicatedUserRateLimit, checkAuth_1.default, createOrg_1.default);
    app.patch('/api/orgs', authenicatedUserRateLimit, checkOrgOwner_1.default, updateOrg_1.default);
    app.get('/api/orgs', unAuthenicatedUserRateLimit, getOrg_1.default);
    app.delete('/api/orgs', authenicatedUserRateLimit, checkOrgOwner_1.default, deleteOrg_1.default);
    app.delete('/api/orgs/leave', authenicatedUserRateLimit, checkEngagementMember_1.default, leaveOrg_1.default);
    app.post('/api/widgets', authenicatedUserRateLimit, checkEngagementAdmin_1.default, createWidget_1.default);
    app.patch('/api/widgets', authenicatedUserRateLimit, checkEngagementAdmin_1.default, updateWidget_1.default);
    app.delete('/api/widgets', authenicatedUserRateLimit, checkEngagementAdmin_1.default, deleteWidget_1.default);
    app.get('/api/cache', dumpCache_1.default);
    app.delete('/api/cache', clearCache_1.default);
    app.post('/api/slackbot/stats', checkSlackSignature_1.default, stats_1.default);
    app.post('/api/logs/logFrontendError', logFrontendError_1.default);
    app.use(errorHandler_1.default);
    app.get('*', forceSSL, (_, res) => {
        return res.sendFile(path_1.default.join(__dirname + '/../', 'build-client', 'index.html'), { acceptRanges: false });
    });
    if (config_1.isDev) {
        app.listen(Number(port), '127.0.0.1', () => console.log('App is running on 127.0.0.1'));
    }
    else {
        app.listen(Number(port), () => console.log('App is running'));
    }
    process.on('uncaughtException', (error, origin) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const logData = `Origin: ${origin} - ${error.stack}`;
        console.log('Uncaught Exception:  ', logData);
        try {
            if (!config_1.isDev) {
                yield database_1.pool.query('INSERT INTO app_logs (type, data) VALUES ("uncaught-error", ?)', [logData]);
                yield email_1.default.sendEmail({
                    from: (_a = email_1.default.senders) === null || _a === void 0 ? void 0 : _a.info,
                    to: (_b = email_1.default.senders) === null || _b === void 0 ? void 0 : _b.error,
                    subject: `Zeforis - Uncaught Error`,
                    text: logData,
                    html: logData
                });
                yield slackbot_1.default.post({
                    channel: (_c = slackbot_1.default.channels) === null || _c === void 0 ? void 0 : _c.errors,
                    message: `*FATAL Uncaught Server Error*\n${logData}`
                });
            }
        }
        catch (newError) {
            console.log('Error handling uncaughtException:  ', newError);
        }
        finally {
            process.exit(1);
        }
    }));
});
boot();
