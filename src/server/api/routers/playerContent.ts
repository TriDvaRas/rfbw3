import { TRPCClientError } from "@trpc/client";
import _, { includes } from "lodash";
import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getDefaultPlayerNodes } from "../../../utils/fieldSetup";
import { env } from "../../../env.mjs";

export const playerContentRouter = createTRPCRouter({
  createPlayerInitialTiles: playerProtectedProcedure.input(z.object({
    playerId: z.string().uuid(),
    fieldRoot: z.string().regex(/\d{1,3},\d{1,3}/).optional()
  })).mutation(async ({ ctx }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const player = ctx.player
      //throw if players root is not 0,0 
      if (player.fieldRoot !== "0,0") {
        switch (env.NODE_ENV) {
          case 'production':
            throw new TRPCClientError("Player already has initial tiles");
          default:
            await ctx.prisma.player.update({
              where: {
                id: player.id,
              },
              data: {
                fieldRoot: "0,0",
              },
            });
            await ctx.prisma.playerTile.deleteMany({
              where: {
                playerId: player.id,
              }
            })
            await ctx.prisma.playerContent.deleteMany({
              where: {
                playerId: player.id,
              }
            })
            break;
        }
      }
      //generate root
      const root = [_.random(36, 39) * 2, _.random(36, 39) * 2 + 1] as const
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

      return await prisma.playerTile.createMany({
        data: nodes.map((node) => ({
          playerId: player.id,
          tileId: `${node.x},${node.y}`,
          type: node.type,
          hardConnectedTo: node.hardConnections || [],
          allowsContentType: node.contentType,
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
            playerContent: {
              include: {
                content: {
                  include: {
                    DLCs: true,
                  }
                },
              }
            },
          }
        }
      },
    })
    return player.playerTiles;
  }),

});
