import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({

  getMe: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      }
    });
  }),
  updateApplicationMessage: protectedProcedure.input(z.string().min(0)).mutation(({ ctx, input }) => {
    return ctx.prisma.user.update({
      data: {
        applicationComment: input,
      },
      where: {
        id: ctx.session.user.id,
      }
    });
  }),

});
