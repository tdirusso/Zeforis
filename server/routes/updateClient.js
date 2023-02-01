const pool = require('../../database');

module.exports = async (req, res) => {
  const {
    name,
    clientId
  } = req.body;

  if (!clientId) {
    return res.json({
      message: 'No client ID supplied.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing client name.'
    });
  }

  try {
    const [clientResult] = await pool.query(
      'SELECT account_id FROM clients WHERE id = ?',
      [clientId]
    );

    const client = clientResult[0];

    if (client) {
      await updateClient(name, clientId);

      const clientObject = {
        id: clientId,
        name,
        accountId: client.account_id
      };

      return res.json({
        client: clientObject
      });
    }

    return res.json({ message: 'Client does not exist.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};

async function updateClient(name, clientId) {
  await pool.query(
    'UPDATE clients SET name = ? WHERE id = ?',
    [name, clientId]
  );
}