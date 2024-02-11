import s3 from '../../aws/s3';
import sharp from 'sharp';
import { pool } from '../../database';
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import fileUpload from 'express-fileupload';
import { EnvVariable, getEnvVariable } from '../../types/EnvVariable';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const acceptMimes = ['image/png', 'image/jpeg'];
const AWSBucket = getEnvVariable(EnvVariable.AWS_S3_BUCKET_NAME);
const AWSOrgLogosFolder = getEnvVariable(EnvVariable.AWS_S3_ORG_LOGO_FOLDER);
const AWSBucketRegion = getEnvVariable(EnvVariable.AWS_S3_BUCKET_REGION);

export default async (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    brandColor = '#3365f6',
    isLogoChanged = false
  } = req.body;

  const logoFile = req.files?.logoFile;
  const orgId = req.ownedOrg.id;

  if (Array.isArray(logoFile)) {
    return res.json({
      message: 'Provide only one logoFile - received Array.'
    });
  }

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
    const [orgResult] = await pool.query<RowDataPacket[]>(
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

async function updateOrg(name: string, brandColor: string, orgId: number) {
  await pool.query(
    'UPDATE orgs SET name = ?, brand_color = ? WHERE id = ?',
    [name, brandColor, orgId]
  );
}

async function updateOrgWithLogoChange(name: string, brandColor: string, orgId: number, existingLogoUrl: string | null | undefined, logoFile: fileUpload.UploadedFile | undefined) {
  if (existingLogoUrl) {
    const command = new DeleteObjectCommand({
      Bucket: AWSBucket,
      Key: existingLogoUrl.split('.com/')[1]
    });

    await s3.send(command);
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
        const uploadFileName = `${AWSOrgLogosFolder}/${orgId}-${now}.png`;

        const command = new PutObjectCommand({
          Key: uploadFileName,
          Body: resizedLogoBuffer,
          Bucket: AWSBucket
        });

        await s3.send(command);
        updatedLogoUrl = `https://${AWSBucket}.s3.${AWSBucketRegion}.amazonaws.com/${uploadFileName}`;
      }
    }
  }

  await pool.query(
    'UPDATE orgs SET name = ?, brand_color = ?, logo_url = ? WHERE id = ?',
    [name, brandColor, updatedLogoUrl, orgId]
  );

  return updatedLogoUrl;
}