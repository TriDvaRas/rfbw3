import fs from 'fs';
import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const rulesRouter = createTRPCRouter({
  getRules: publicProcedure.query(({ ctx }) => {
    return fs.readFileSync('./public/rules.md', 'utf8');
  }),
});
