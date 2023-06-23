import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure
} from "~/server/api/trpc";
import { playerProfileSchema } from "../../../pages/me";

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
  createMyPlayer: protectedProcedure.input(playerProfileSchema).mutation(({ ctx, input }) => {
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
  updateMyPlayer: playerProtectedProcedure.input(playerProfileSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.player.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        name: input.name,
        about: input.motto,
        imageUrl: input.imageUrl,
      },
    });
  }),

});
