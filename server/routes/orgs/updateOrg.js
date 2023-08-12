const s3 = require('../../../aws/s3');
const sharp = require('sharp');
const pool = require('../../../database');

const acceptMimes = ['image/png', 'image/jpeg'];

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  require('dotenv').config({ path: __dirname + '/../.env.local' });
}

module.exports = async (req, res, next) => {
  const {
    name,
    brandColor = '#3365f6',
    orgId,
    isLogoChanged = false
  } = req.body;

  const logoFile = req.files?.logoFile;

  if (!orgId) {
    return res.json({
      message: 'No Org ID supplied.'
    });
  }

  if (!name) {
    return res.json({
      message: 'Missing Org name.'
    });
  }

  try {
    const [orgResult] = await pool.query(
      'SELECT logo_url, id FROM orgs WHERE id = ?',
      [orgId]
    );

    const org = orgResult[0];

    let updatedLogoUrl = org.logo_url;

    if (org) {
      if (isLogoChanged === 'true') {
        updatedLogoUrl = await updateOrgWithLogoChange(name, brandColor, orgId, org.logo_url, logoFile);
      } else {
        await updateOrg(name, brandColor, orgId);
      }

      return res.json({
        success: true,
        org: {
          id: org.id,
          name,
          brandColor,
          logo: updatedLogoUrl
        }
      });
    }

    return res.json({ message: 'Org does not exist.' });
  } catch (error) {
    next(error);
  }
};

async function updateOrg(name, brandColor, orgId) {
  await pool.query(
    'UPDATE orgs SET name = ?, brand_color = ? WHERE id = ?',
    [name, brandColor, orgId]
  );
}

async function updateOrgWithLogoChange(name, brandColor, orgId, existingLogoUrl, logoFile) {
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
        const uploadFileName = `${process.env.AWS_S3_ORG_LOGO_FOLDER}/${orgId}-${now}.png`;

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
    'UPDATE orgs SET name = ?, brand_color = ?, logo_url = ? WHERE id = ?',
    [name, brandColor, updatedLogoUrl, orgId]
  );

  return updatedLogoUrl;
}