import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter, playerProtectedProcedure
} from "~/server/api/trpc";
import { selectWeightedContent } from "../../../../utils/random";
import { getSelfContentMultiplier } from "../../../../utils/entropy";


export const gameContentRouter = createTRPCRouter({
  rollNewContent: playerProtectedProcedure.input(z.object({
    type: z.enum(["game", "movie", "anime"]),
    playerTileId: z.string().uuid(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const rolledContents = await prisma.playerContent.findMany({
        where: {
          playerId: ctx.player.id,
          content: {
            type: input.type
          },
        },
        select: {
          contentId: true,
          status: true,
        }
      });

      if (ctx.player[`${input.type}Slots`] <= rolledContents.filter(x => x.status == 'inProgress').length)
        throw new TRPCClientError("Недостаточно слотов для нового контента");

      const rollableContents = await prisma.content.findMany({
        where: {
          type: input.type,
          id: {
            notIn: rolledContents.map(x => x.contentId)
          }
        },
        select: {
          id: true,
          baseWeight: true,
          ownedById: true,
          weightMods: {
            where: {
              AND: [
                { isValid: true },
                {
                  OR: [
                    {
                      type: 'global',
                    },
                    {
                      type: 'player',
                      playerId: ctx.player.id,
                    }
                  ]
                }
              ]
            },
            select: {
              isValid: true,
              multiplier: true,
              type: true,
              invalidateAt: true,
              invalidateOn: true,
            }
          }
        }
      })

      //apply entropy to base weights
      const selfRollMultiplier = await getSelfContentMultiplier()
      for (const cnt of rollableContents) {
        if (cnt.ownedById == ctx.player.id)
          cnt.baseWeight *= selfRollMultiplier;
      }

      const rolledContent = selectWeightedContent(rollableContents);
      if (!rolledContent)
        throw new TRPCClientError("Нет доступного контента для ролла");
      const pContent = await prisma.playerContent.create({
        data: {
          source: 'field',
          playerTileId: input.playerTileId,
          playerId: ctx.player.id,
          contentId: rolledContent.id,
          status: 'inProgress',
        }
      })
      await prisma.playerTile.update({
        where: {
          id: input.playerTileId,
        },
        data: {
          playerContentId: pContent.id,
          allowsContentType: input.type,
        }
      })
      return pContent;
    });
  }),
  completeContent: playerProtectedProcedure.input(z.object({
    type: z.enum(["dropped", "rerolled", "completed"]),
    playerTileId: z.string().uuid(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      const pTile = await prisma.playerTile.findUnique({
        where: {
          id: input.playerTileId,
        },
        include: {
          tile: true,
          playerContent: {
            include: {
              content: true,
            }
          },
        }
      });
      if (!pTile)
        throw new TRPCClientError("Пиздец. Остров не найден");
      if (!pTile.playerContent || !pTile.playerContentId)
        throw new TRPCClientError("Остров не содержит контента");
      if (pTile.playerContent.status != 'inProgress')
        throw new TRPCClientError("Контент уже завершен");
      if (pTile.playerContent.playerId != ctx.player.id)
        throw new TRPCClientError("Контент не принадлежит нам");

      await prisma.playerContent.update({
        where: {
          id: pTile.playerContentId,
        },
        data: {
          status: input.type,
        }
      })
      // add create new playerTiles for connected tiles if not created already
      const connections = [...pTile.hardConnectedTo, ...pTile.tile.connectedTo];
      const existingTiles = await prisma.playerTile.findMany({
        where: {
          playerId: ctx.player.id,
          tileId: {
            in: connections
          }
        },
        select: {
          id: true,
          tileId: true,
        }
      })
      const missingConnections = connections.filter(x => !existingTiles.some(y => y.tileId == x));
      await prisma.playerTile.createMany({
        data: missingConnections.map(x => ({
          playerId: ctx.player.id,
          tileId: x,
          type: 'field',
        }))
      })
      //add points to player based on content.hours 
      if (input.type !== 'rerolled') {

      }
      await prisma.player.update({
        where: {
          id: ctx.player.id,
        },
        data: {
          points: {
            increment: +pTile.playerContent.content.hours * (input.type == 'completed' ? 10 : -5)
          }
        }
      })
      return null
    })
  }),
});
