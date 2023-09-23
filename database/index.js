const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
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
  getOrgTaskCount: async (con, orgId) => {
    const [taskCountResult] = await con.query(
      ` 
        SELECT COUNT(DISTINCT tasks.id) AS taskCount
        FROM tasks
        LEFT JOIN folders ON folders.id = tasks.folder_id
        LEFT JOIN engagements ON engagements.id = folders.engagement_id
        WHERE engagements.org_id = ?
      `,
      [orgId]
    );

    return taskCountResult[0].taskCount;
  },
  getOrgOwnerPlan: async (con, orgId) => {
    const [orgOwnerPlanResult] = await con.query(
      'SELECT users.plan FROM orgs LEFT JOIN users ON orgs.owner_id = users.id WHERE orgs.id = ?',
      [orgId]
    );

    return orgOwnerPlanResult[0].plan;
  },
  getOrgAdminCount: async (con, orgId) => {
    const [orgAdminCountResult] = await con.query(
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
  }
};

module.exports = {
  pool,
  initializeDatabase,
  commonQueries
};