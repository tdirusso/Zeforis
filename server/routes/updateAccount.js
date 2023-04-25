const s3 = require('../../aws/s3');
const sharp = require('sharp');
const pool = require('../../database');

const acceptMimes = ['image/png', 'image/jpeg'];

module.exports = async (req, res) => {
  const {
    name,
    brandColor = '#3365f6',
    accountId,
    isLogoChanged
  } = req.body;

  const logoFile = req.files?.logoFile;

  if (!accountId) {
    return res.json({
      message: 'No account ID supplied.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing account name.'
    });
  }

  try {

    const [accountResult] = await pool.query(
      'SELECT logo_url, id FROM accounts WHERE id = ?',
      [accountId]
    );

    const account = accountResult[0];

    if (account) {
      if (isLogoChanged === 'true') {
        await updateAccountWithLogoChange(name, brandColor, accountId, account.logo_url, logoFile);
      } else {
        await updateAccount(name, brandColor, accountId);
      }

      return res.json({
        success: true
      });
    }

    return res.json({ message: 'Account does not exist.' });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};

async function updateAccount(name, brandColor, accountId) {
  await pool.query(
    'UPDATE accounts SET name = ?, brand_color = ? WHERE id = ?',
    [name, brandColor, accountId]
  );
}

async function updateAccountWithLogoChange(name, brandColor, accountId, existingLogoUrl, logoFile) {
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
        const uploadFileName = `account-logos/${accountId}-${now}.png`;

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
    'UPDATE accounts SET name = ?, brand_color = ?, logo_url = ? WHERE id = ?',
    [name, brandColor, updatedLogoUrl, accountId]
  );
}