import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/db';


export default async function requireApiSession(req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.cookies['next-auth.session-token']

    if (!sessionToken) {
        return res.sendStatus(403);
    }

    try {
        const session = await prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true }
        });

        if (!session) {
            return res.sendStatus(403);
        }

        // Attach the session to the request for further processing
        req.session = session;
        next();
    } catch (error) {
        console.error('Error retrieving session:', error);
        return res.sendStatus(500);
    }
}