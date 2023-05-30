import { type Session, type User } from '@prisma/client';
import cookieParser from 'cookie-parser';
import express, { type Request } from 'express';
import './env';
import { env } from './env';
import router from './router';


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
export interface RequestWithSession extends Request {
    session: Session & {
        user: User;
    }
}


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/', router)
app.listen(env.EXPRESS_PORT, () => {
    console.log(`Server is running on port ${env.EXPRESS_PORT}`);
});