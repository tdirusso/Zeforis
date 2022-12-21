const Client = require('../../models/client');
const User = require('../../models/user');
const s3 = require('../../aws/s3');
const sharp = require('sharp');

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
    const client = await Client.create({
      name,
      brandColor,
      account: accountId,
      admins: [userId]
    });

    await User.updateOne({ _id: userId }, { $push: { adminOfClients: client._id } });

    if (logoFile) {
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