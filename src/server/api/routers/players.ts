import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure
} from "~/server/api/trpc";

export const playersRouter = createTRPCRouter({


  getMyPlayer: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.player.findUnique({
      where: {
        userId: ctx.session.user.id,
      }
    });
  }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.player.findMany();
  }),
  createMyPlayer: protectedProcedure.input(z.object({
    name: z.string().min(1),
    motto: z.string().min(1),
    imageUrl: z.string().optional(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.player.create({
      data: {
        name: input.name,
        about: input.motto,
        imageUrl: input.imageUrl,
        userId: ctx.session.user.id,
        addedById: ctx.session.user.id,
        fieldRoot: '0,0',
      },
    });
  }),

});
