const s3 = require('../../aws/s3');
const sharp = require('sharp');
const pool = require('../../database');

const acceptMimes = ['image/png', 'image/jpeg'];

module.exports = async (req, res) => {
  const {
    name,
    brandColor,
    accountId
  } = req.body;

  const { userId } = req;

  const logoFile = req.files?.logoFile;

  if (!name) {
    return res.json({
      message: 'Missing client name.'
    });
  }

  try {
    const newClient = await pool.query(
      'INSERT INTO clients (name, account_id, brand_color) VALUES (?,?,?)',
      [name, accountId, brandColor]
    );

    const newClientId = newClient[0].insertId;

    await pool.query(
      'INSERT INTO client_users (client_id, user_id, role) VALUES (?,?, "admin")',
      [newClientId, userId]
    );

    let logoUrl = '';

    if (logoFile) {
      if (acceptMimes.includes(logoFile.mimetype)) {
        const resizedLogoBuffer = await sharp(logoFile.data)
          .resize({ width: 250 })
          .toFormat('png')
          .toBuffer();

        const resizedLogoSize = Buffer.byteLength(resizedLogoBuffer);
        if (resizedLogoSize <= 250000) { //250,000 bytes -> 250 kb -> 0.25 mb
          const now = Date.now();
          const uploadFileName = `client-logos/${newClientId}-${now}.png`;

          const s3ObjectParams = {
            Key: uploadFileName,
            Body: resizedLogoBuffer,
            ACL: 'public-read'
          };

          const s3Result = await s3.upload(s3ObjectParams).promise();

          logoUrl = s3Result.Location;

          await pool.query(
            'UPDATE clients SET logo_url = ? WHERE client_id = ?',
            [logoUrl, newClientId]
          );
        }
      }
    }

    const clientObject = {
      id: newClientId,
      name,
      brandColor,
      accountId,
      logoUrl
    };

    return res.json({ client: clientObject });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};