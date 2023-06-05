import { includes } from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const fieldNodesRouter = createTRPCRouter({
  
  getMy: protectedProcedure.query(async ({ ctx }) => {
    const player = await ctx.prisma.player.findFirstOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        playerTiles: {
          include: {
            tile: true,
            playerContents: true,
          }
        }
      },
    })
    return player.playerTiles;
  }),

});
