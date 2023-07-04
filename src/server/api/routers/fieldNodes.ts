import { TRPCClientError } from "@trpc/client";
import _, { includes } from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getDefaultPlayerNodes } from "../../../utils/fieldSetup";

export const fieldNodesRouter = createTRPCRouter({
  createPlayerInitialTiles: protectedProcedure.input(z.object({
    playerId: z.string().uuid(),
    fieldRoot: z.string().regex(/\d{1,3},\d{1,3}/).optional()
  })).mutation(async ({ ctx }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      //throw if players root is not 0,0 
      const player = await ctx.prisma.player.findFirstOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (player.fieldRoot !== "0,0") {
        throw new TRPCClientError("Player already has initial tiles");
      }
      //generate root
      const root = [_.random(72, 78), _.random(72, 78)] as const
      // set players fieldRoot
      await prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          fieldRoot: root.join(","),
        },
      });
      const nodes = getDefaultPlayerNodes(root[0], root[1]);
      console.log(nodes);
      
      return await prisma.playerTile.createMany({
        data: nodes.map((node) => ({
          playerId: player.id,
          tileId: `${node.x},${node.y}`,
          type: node.type,
        }))
      })
    });
  }),
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
