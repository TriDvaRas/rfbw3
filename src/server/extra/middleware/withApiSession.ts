import { type Request, type Response, type NextFunction } from 'express';
import prisma from '../lib/db';


export default async function withApiSession(req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.cookies['next-auth.session-token']
    if (!sessionToken) {
        return next();
    }
    try {
        const session = await prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true }
        });

        if (!session) {
            return next();
        }

        // Attach the session to the request for further processing
        req.session = session;
        next();
    } catch (error) {
        console.error('Error retrieving session:', error);
        return res.sendStatus(500);
    }
}