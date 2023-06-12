import { NextApiRequest, NextApiResponse } from 'next';
import { S3 } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from 'zod';
import { getServerAuthSession } from '../../server/auth';
import { env } from '../../env.mjs';
import { uuid } from 'uuidv4';

// Define the schema for the incoming payload
const UploadSchema = z.object({
    fileName: z.string(),
    mimeType: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const session = await getServerAuthSession({ req, res });

    if (!session?.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    let data;

    try {
        data = UploadSchema.parse(JSON.parse(req.body));
    } catch (error) {
        console.log(error);
        res.status(400).json({ error, message: 'Invalid input' });
        return;
    }

    const s3 = new S3({
        region: env.S3_REGION,
        // accessKeyId: env.S3_ACCESS_KEY,
        // secretAccessKey: env.S3_SECRET_KEY,
        credentials: {
            accessKeyId: env.S3_ACCESS_KEY,
            secretAccessKey: env.S3_SECRET_KEY,
        }
    });
    const _uuid = uuid();
    const Key = `rfbw/${session.user.name}/${_uuid}-${data.fileName}`;
    try {
        const { fields, url } = await createPresignedPost(s3, {
            Bucket: env.S3_BUCKET,
            Key,
            Conditions: [
                ['content-length-range', 0, 16 * 1024 * 1024], // max size 16MB, adjust as needed
                ['eq', '$Content-Type', data.mimeType],
                ['starts-with', '$key', 'rfbw/'],
                { acl: 'public-read' },
                { bucket: env.S3_BUCKET }
            ],
            Expires: 60, // link expiration time in seconds
        });
        console.log(url, fields);
        res.status(200).json({ url, fields, Key });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error creating pre-signed URL' });
    }

}