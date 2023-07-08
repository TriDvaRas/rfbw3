import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { playerProfileSchema } from "../../../pages/me";
import { PlayerSphereType } from "@prisma/client";

export const playersRouter = createTRPCRouter({
  getAllPlayersWithContent: publicProcedure.input(z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
  })).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const { cursor } = input;
    const items = await ctx.prisma.player.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        ownedContent: true,
      },
    })
    let nextCursor: typeof cursor | undefined = undefined;
    if (items.length > limit) {
      const nextItem = items.pop()
      nextCursor = nextItem!.id;
    }
    return {
      items,
      nextCursor,
    };
  }),
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
  updateMyPlayerSphereType: playerProtectedProcedure.input(z.enum(Object.values(PlayerSphereType) as unknown as [string])).mutation(({ ctx, input }) => {
    return ctx.prisma.player.update({
      where: {
        userId: ctx.session.user.id,
      },
      data: {
        sphereType: input as PlayerSphereType,
      },
    });
  }),


});
