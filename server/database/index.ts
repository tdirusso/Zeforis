import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import cache from '../cache';
import { CachedOrg } from '../types/Cache';
import { getEnvVariable, EnvVariable } from '../types/EnvVariable';


const pool = mysql.createPool({
  host: getEnvVariable(EnvVariable.MYSQL_HOST),
  user: getEnvVariable(EnvVariable.MYSQL_USER),
  password: getEnvVariable(EnvVariable.MYSQL_PASSWORD),
  database: getEnvVariable(EnvVariable.MYSQL_DATABASE),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
  } catch (error) {
    console.error('Error establishing database connection:  ', error);
  }
};

const commonQueries = {
  getOrgTaskCount: async (connection: mysql.PoolConnection, orgId: string | number) => {
    let cachedOrgData: CachedOrg = cache.get(`org-${orgId}`);
    let orgTaskCount = cachedOrgData?.taskCount;

    if (!orgTaskCount) {
      const [taskCountResult] = await connection.query<RowDataPacket[]>(
        ` 
          SELECT COUNT(DISTINCT tasks.id) AS taskCount
          FROM tasks
          LEFT JOIN folders ON folders.id = tasks.folder_id
          LEFT JOIN engagements ON engagements.id = folders.engagement_id
          WHERE engagements.org_id = ?
        `,
        [orgId]
      );

      orgTaskCount = taskCountResult[0].taskCount;
      cache.set(`org-${orgId}`, { ...cachedOrgData, taskCount: orgTaskCount });
    }

    return orgTaskCount;
  },
  getOrgOwnerPlan: async (connection: mysql.PoolConnection, orgId: string | number) => {
    let cachedOrgData: CachedOrg = cache.get(`org-${orgId}`);
    let orgOwnerPlan = cachedOrgData?.ownerPlan;

    if (orgOwnerPlan === undefined) {
      const [planResult] = await connection.query<RowDataPacket[]>(
        'SELECT users.plan FROM orgs LEFT JOIN users ON orgs.owner_id = users.id WHERE orgs.id = ?',
        [orgId]
      );

      orgOwnerPlan = planResult[0].plan;

      cache.set(`org-${orgId}`, { ...cachedOrgData, ownerPlan: orgOwnerPlan });
    }

    return orgOwnerPlan;
  },
  getOrgAdminCount: async (connection: mysql.PoolConnection, orgId: string | number) => {
    const [orgAdminCountResult] = await connection.query<RowDataPacket[]>(
      ` 
      SELECT COUNT(DISTINCT user_id) AS adminCount
      FROM engagement_users
      LEFT JOIN engagements ON engagement_users.engagement_id = engagements.id
      LEFT JOIN orgs ON orgs.id = engagements.org_id
      WHERE engagements.org_id = ? AND role = 'admin'
      `,
      [orgId]
    );

    return orgAdminCountResult[0].adminCount;
  },
  getEngagementHiddenFolder: async (connection: mysql.PoolConnection, engagementId: string | number) => {
    let folderId = cache.get(`hiddenFolder-eng${engagementId}`);

    if (!folderId) {
      const [hiddenFolderResult] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM folders WHERE name = "_hidden_" AND engagement_id = ?',
        [engagementId]
      );

      if (hiddenFolderResult.length) {
        folderId = hiddenFolderResult[0].id;
        cache.set(`hiddenFolder-eng${engagementId}`, folderId);
      } else {
        const [createHiddenFolderResult] = await connection.query<ResultSetHeader>(
          'INSERT INTO folders (name, engagement_id) VALUES ("_hidden_", ?)',
          [engagementId]
        );

        folderId = createHiddenFolderResult.insertId;
        cache.set(`hiddenFolder-eng${engagementId}`, folderId);
      }
    }

    return folderId;
  }
};

const apiFieldMappings = {
  users: {
    'firstName': 'first_name',
    'lastName': 'last_name'
  }
};

export {
  pool,
  initializeDatabase,
  commonQueries,
  apiFieldMappings
};