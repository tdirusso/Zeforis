"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("../../aws/s3"));
const sharp_1 = __importDefault(require("sharp"));
const database_1 = require("../../database");
const EnvVariable_1 = require("../../types/EnvVariable");
const client_s3_1 = require("@aws-sdk/client-s3");
const acceptMimes = ['image/png', 'image/jpeg'];
const AWSBucket = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_S3_BUCKET_NAME);
const AWSOrgLogosFolder = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_S3_ORG_LOGO_FOLDER);
const AWSBucketRegion = (0, EnvVariable_1.getEnvVariable)(EnvVariable_1.EnvVariable.AWS_S3_BUCKET_REGION);
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, brandColor = '#3365f6', isLogoChanged = false } = req.body;
    const logoFile = (_a = req.files) === null || _a === void 0 ? void 0 : _a.logoFile;
    const orgId = req.org.id;
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
        const [orgResult] = yield database_1.pool.query('SELECT logo_url, id FROM orgs WHERE id = ?', [orgId]);
        const org = orgResult[0];
        let updatedLogoUrl = org.logo_url;
        if (org) {
            if (isLogoChanged === 'true') {
                updatedLogoUrl = yield updateOrgWithLogoChange(name, brandColor, orgId, org.logo_url, logoFile);
            }
            else {
                yield updateOrg(name, brandColor, orgId);
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
    }
    catch (error) {
        next(error);
    }
});
function updateOrg(name, brandColor, orgId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.pool.query('UPDATE orgs SET name = ?, brand_color = ? WHERE id = ?', [name, brandColor, orgId]);
    });
}
function updateOrgWithLogoChange(name, brandColor, orgId, existingLogoUrl, logoFile) {
    return __awaiter(this, void 0, void 0, function* () {
        if (existingLogoUrl) {
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: AWSBucket,
                Key: existingLogoUrl.split('.com/')[1]
            });
            yield s3_1.default.send(command);
        }
        let updatedLogoUrl = null;
        if (logoFile) {
            if (acceptMimes.includes(logoFile.mimetype)) {
                const resizedLogoBuffer = yield (0, sharp_1.default)(logoFile.data)
                    .resize({ width: 250 })
                    .toFormat('png')
                    .toBuffer();
                const resizedLogoSize = Buffer.byteLength(resizedLogoBuffer);
                if (resizedLogoSize <= 250000) { //250,000 bytes -> 250 kb -> 0.25 mb
                    const now = Date.now();
                    const uploadFileName = `${AWSOrgLogosFolder}/${orgId}-${now}.png`;
                    const command = new client_s3_1.PutObjectCommand({
                        Key: uploadFileName,
                        Body: resizedLogoBuffer,
                        Bucket: AWSBucket
                    });
                    yield s3_1.default.send(command);
                    updatedLogoUrl = `https://${AWSBucket}.s3.${AWSBucketRegion}.amazonaws.com/${uploadFileName}`;
                }
            }
        }
        yield database_1.pool.query('UPDATE orgs SET name = ?, brand_color = ?, logo_url = ? WHERE id = ?', [name, brandColor, updatedLogoUrl, orgId]);
        return updatedLogoUrl;
    });
}
