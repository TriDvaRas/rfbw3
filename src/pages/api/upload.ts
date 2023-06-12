import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerAuthSession } from '../../server/auth';
import { env } from '../../env.mjs';
import { uuid } from 'uuidv4';


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

    
    

}