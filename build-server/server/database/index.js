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
exports.commonQueries = exports.initializeDatabase = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const cache_1 = __importDefault(require("../cache"));
const EnvVariable_1 = require("../types/EnvVariable");
const Errors_1 = require("../types/Errors");
const pool = promise_1.default.createPool({
    host: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.MYSQL_HOST),
    user: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.MYSQL_USER),
    password: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.MYSQL_PASSWORD),
    database: (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.MYSQL_DATABASE),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.pool = pool;
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        connection.release();
    }
    catch (error) {
        console.error('Error establishing database connection:  ', error);
    }
});
exports.initializeDatabase = initializeDatabase;
const commonQueries = {
    getOrgTaskCount: (connection, orgId) => __awaiter(void 0, void 0, void 0, function* () {
        let cachedOrgData = cache_1.default.get(`org-${orgId}`);
        let orgTaskCount = cachedOrgData === null || cachedOrgData === void 0 ? void 0 : cachedOrgData.taskCount;
        if (!orgTaskCount) {
            const [taskCountResult] = yield connection.query(` 
          SELECT COUNT(DISTINCT tasks.id) AS taskCount
          FROM tasks
          LEFT JOIN folders ON folders.id = tasks.folder_id
          LEFT JOIN engagements ON engagements.id = folders.engagement_id
          WHERE engagements.org_id = ?
        `, [orgId]);
            orgTaskCount = taskCountResult[0].taskCount;
            cache_1.default.set(`org-${orgId}`, Object.assign(Object.assign({}, cachedOrgData), { taskCount: orgTaskCount }));
        }
        return orgTaskCount;
    }),
    getOrgOwnerPlan: (connection, orgId) => __awaiter(void 0, void 0, void 0, function* () {
        let cachedOrgData = cache_1.default.get(`org-${orgId}`);
        let orgOwnerPlan = cachedOrgData === null || cachedOrgData === void 0 ? void 0 : cachedOrgData.ownerPlan;
        if (orgOwnerPlan === undefined) {
            const [planResult] = yield connection.query('SELECT users.plan FROM orgs LEFT JOIN users ON orgs.owner_id = users.id WHERE orgs.id = ?', [orgId]);
            orgOwnerPlan = planResult[0].plan;
            cache_1.default.set(`org-${orgId}`, Object.assign(Object.assign({}, cachedOrgData), { ownerPlan: orgOwnerPlan }));
        }
        if (!orgOwnerPlan) {
            throw new Errors_1.BadRequestError('Could not find org owner plan');
        }
        return orgOwnerPlan;
    }),
    getOrgAdminCount: (connection, orgId) => __awaiter(void 0, void 0, void 0, function* () {
        const [orgAdminCountResult] = yield connection.query(` 
      SELECT COUNT(DISTINCT user_id) AS adminCount
      FROM engagement_users
      LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
      LEFT JOIN orgs ON orgs.id = engagements.org_id
      WHERE engagements.org_id = ? AND role = 'admin'
      `, [orgId]);
        return orgAdminCountResult[0].adminCount;
    }),
    getEngagementHiddenFolder: (connection, engagementId) => __awaiter(void 0, void 0, void 0, function* () {
        let folderId = cache_1.default.get(`hiddenFolder-eng${engagementId}`);
        if (!folderId) {
            const [hiddenFolderResult] = yield connection.query('SELECT id FROM folders WHERE name = "_hidden_" AND engagement_id = ?', [engagementId]);
            if (hiddenFolderResult.length) {
                folderId = hiddenFolderResult[0].id;
                cache_1.default.set(`hiddenFolder-eng${engagementId}`, folderId);
            }
            else {
                const [createHiddenFolderResult] = yield connection.query('INSERT INTO folders (name, engagement_id) VALUES ("_hidden_", ?)', [engagementId]);
                folderId = createHiddenFolderResult.insertId;
                cache_1.default.set(`hiddenFolder-eng${engagementId}`, folderId);
            }
        }
        return folderId;
    })
};
exports.commonQueries = commonQueries;
