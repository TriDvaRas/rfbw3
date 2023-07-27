import fs from 'fs';
import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const metaRouter = createTRPCRouter({
  amIAdmin: publicProcedure.query(({ ctx }) => {
    return ctx.session?.user.roles.includes('ADMIN') ?? false;
  }),
});
