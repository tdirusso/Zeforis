const Client = require('../../models/client');
const s3 = require('../../aws/s3');
const sharp = require('sharp');

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
    const client = await Client.findById(clientId);

    if (!client) {
      return res.json({
        message: 'This client does not exist.'
      });
    }

    client.name = name;
    client.brandColor = brandColor;

    await client.save();

    if (isLogoChanged) {
      if (client.logoUrl) {
        await s3.deleteObject({ Key: client.logoUrl.split('.com/')[1] }).promise();
      }

      if (!logoFile) {
        client.logoUrl = '';
        await client.save();
      } else {
        if (acceptMimes.includes(logoFile.mimetype)) {
          const resizedLogoBuffer = await sharp(logoFile.data)
            .resize({ width: 250 })
            .toFormat('png')
            .toBuffer();

          const resizedLogoSize = Buffer.byteLength(resizedLogoBuffer);
          if (resizedLogoSize <= 250000) { //250,000 bytes -> 250 kb -> 0.25 mb
            const now = Date.now();
            const uploadFileName = `client-logos/${client._id}-${now}.png`;

            const s3ObjectParams = {
              Key: uploadFileName,
              Body: resizedLogoBuffer,
              ACL: 'public-read'
            };

            const s3Result = await s3.upload(s3ObjectParams).promise();

            client.logoUrl = s3Result.Location;
            await client.save();
          }
        }
      }
    }

    return res.json({
      client: client.toObject()
    });
  } catch (error) {
    console.log(error);

    return res.json({
      message: error.message
    });
  }
};