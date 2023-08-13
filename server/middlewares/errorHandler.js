const { TokenExpiredError } = require("jsonwebtoken");
const { pool } = require('../../database');

module.exports = async (error, req, res, _) => {
  if (!(error instanceof TokenExpiredError)) {
    console.error('Application error:  ', error);
    await pool.query(
      'INSERT INTO app_logs (type, data) VALUES (?,?)',
      ['handled-error', error.stack]
    );
  }

  return res.json({
    error: true,
    message: error.message
  });
};