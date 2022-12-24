const s3 = require('../../aws/s3');
const sharp = require('sharp');
const pool = require('../../database');

const acceptMimes = ['image/png', 'image/jpeg'];

module.exports = async (req, res) => {
  const {
    name,
    brandColor,
    clientId,
    isLogoChanged
  } = req.body;

  const logoFile = req.files?.logoFile;

  if (!clientId) {
    return res.json({
      message: 'No client ID supplied.'
    });
  }

  if (!name || !brandColor) {
    return res.json({
      message: 'Missing client name.'
    });
  }

  try {

    const [clientResult] = await pool.query(
      'SELECT logo_url, account_id FROM clients WHERE id = ?',
      [clientId]
    );

    const client = clientResult[0];

    if (client) {
      let logoUrl = client.logo_url;

      if (isLogoChanged) {
        logoUrl = await updateClientWithLogoChange(name, brandColor, clientId, client.logo_url, logoFile);
      } else {
        await updateClient(name, brandColor, clientId);
      }

      const clientObject = {
        id: clientId,
        name,
        brandColor,
        accountId: client.account_id,
        logoUrl
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

async function updateClient(name, brandColor, clientId) {
  await pool.query(
    'UPDATE clients SET name = ?, brand_color = ? WHERE id = ?',
    [name, brandColor, clientId]
  );
}

async function updateClientWithLogoChange(name, brandColor, clientId, existingLogoUrl, logoFile) {
  if (existingLogoUrl) {
    await s3.deleteObject({ Key: existingLogoUrl.split('.com/')[1] }).promise();
  }

  let updatedLogoUrl = null;

  if (logoFile) {
    if (acceptMimes.includes(logoFile.mimetype)) {
      const resizedLogoBuffer = await sharp(logoFile.data)
        .resize({ width: 250 })
        .toFormat('png')
        .toBuffer();

      const resizedLogoSize = Buffer.byteLength(resizedLogoBuffer);
      if (resizedLogoSize <= 250000) { //250,000 bytes -> 250 kb -> 0.25 mb
        const now = Date.now();
        const uploadFileName = `client-logos/${clientId}-${now}.png`;

        const s3ObjectParams = {
          Key: uploadFileName,
          Body: resizedLogoBuffer,
          ACL: 'public-read'
        };

        const s3Result = await s3.upload(s3ObjectParams).promise();

        updatedLogoUrl = s3Result.Location;
      }
    }
  }

  await pool.query(
    'UPDATE clients SET name = ?, brand_color = ?, logo_url = ? WHERE id = ?',
    [name, brandColor, updatedLogoUrl, clientId]
  );

  return updatedLogoUrl;
}