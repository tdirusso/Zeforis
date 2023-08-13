const { pool } = require('../../../database');

module.exports = async (req, res, next) => {

  const connection = await pool.getConnection();

  try {
    const [usersCountResult] = await connection.query('SELECT COUNT(id) AS count FROM users');
    const [engagementsCountResult] = await connection.query('SELECT COUNT(id) AS count FROM engagements');
    const [tasksCountResult] = await connection.query('SELECT COUNT(id) AS count FROM tasks');

    const botMessage = `
      *Current Zeforis Statistics*

      🙋🏼‍♂️ ${usersCountResult[0].count} Users\n
      📋 ${engagementsCountResult[0].count} Engagements\n
      ✅ ${tasksCountResult[0].count} Tasks
    `;

    connection.release();

    return res.end(botMessage);
  } catch (error) {
    connection.release();
    next(error);
  }
};