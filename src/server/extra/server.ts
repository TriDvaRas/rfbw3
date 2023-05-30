import express, { type Request, type Response, type NextFunction } from 'express';
import { PrismaClient, type Session, type User } from '@prisma/client';

const prisma = new PrismaClient();
declare module 'express' {
    interface Request {
        cookies: {
            'next-auth.session-token': string;
        };
        session?: Session & {
            user: User;
        };
    }
}
declare module 'express-serve-static-core' {
    interface Request {
        session: Session & {
            user: User;
        };
    }
}
interface RequestWithSession extends Request {
    session: Session & {
        user: User;
    }
}
const withSession = async (req: Request, res: Response, next: NextFunction) => {
    const sessionCookie = req.cookies['next-auth.session-token']

    if (!sessionCookie) {
        return res.sendStatus(403);
    }

    try {
        const session = await prisma.session.findUnique({
            where: {
                sessionToken: sessionCookie,
            },
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
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply the withSession middleware to the /api/extra/test endpoint
app.get('/api/extra/test', withSession, (req: RequestWithSession, res) => {
    // Access the session attached to the request
    const { session } = req;
    const userId = session.user.name;

    // Example response
    res.json({ message: `Hello, user ${userId}!` });
});

app.listen(3001, () => {
    console.log('Server is running on port 3000');
});