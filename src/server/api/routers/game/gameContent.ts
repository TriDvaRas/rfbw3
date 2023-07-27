import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter, playerProtectedProcedure
} from "~/server/api/trpc";
import { selectWeightedContent } from "../../../../utils/random";
import { addNewEntropy, getEntropyGainMultiplier, getMoneyGainMultiplier, getSelfContentMultiplier } from "../../../../utils/entropy";
import { submitContentFinishFeed, submitContentRollResultFeed } from "../../../../utils/feed";
import _ from "lodash";
import { incrementPlayerMoney, incrementPlayerPoints } from "../../../../utils/points";


export const gameContentRouter = createTRPCRouter({
  rollNewContent: playerProtectedProcedure.input(z.object({
    type: z.enum(["game", "movie", "anime"]),
    playerTileId: z.string().uuid(),
  })).mutation(({ ctx, input }) => {
    if (!ctx.player.canDoGaming)
      throw new TRPCClientError("Я тебе запрещаю производить гейминг");
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
        },
        include: {
          content: {
            include: {
              DLCs: true,
            }
          },
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
      await submitContentRollResultFeed(ctx.prisma, {
        playerId: ctx.player.id,
        contentId: rolledContent.id,
        content: pContent.content,
        player: ctx.player,
      })
      return pContent;
    });
  }),
  completeContent: playerProtectedProcedure.input(z.object({
    type: z.enum(["dropped", "rerolled", "completed"]),
    playerTileId: z.string().uuid(),
    DLCIds: z.array(z.string().uuid()).optional(),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      if (!ctx.player.canDoGaming)
        throw new TRPCClientError("Я тебе запрещаю производить гейминг");

      const pTile = await prisma.playerTile.findUnique({
        where: {
          id: input.playerTileId,
        },
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
      const selectedDLCs = (input.DLCIds ?? []).map(id => pTile.playerContent!.content.DLCs.find(x => x.id == id));
      if (selectedDLCs.some(x => !x))
        throw new TRPCClientError("Выбранно не существующее DLC :)");
      const hours = (selectedDLCs.map(x=> +x!.hours).reduce((a, b) => a + b, +pTile.playerContent.content.hours));

      const pointsDelta = input.type == 'rerolled' ? 0 : Math.round(+hours * (input.type == 'completed' ? 10 : -5))
      const moneyDelta = Math.round(+hours * (input.type == 'completed' ? await getMoneyGainMultiplier() : 0))
      const entropyDelta = Math.round((input.type == 'completed' ? _.random(1, 3) : _.random(2, 5)) * (await getEntropyGainMultiplier()))
      // add/subtract points to player based on pointsDelta 
      if (pointsDelta !== 0)
        await incrementPlayerPoints(ctx.player.id, pointsDelta)
      // add/subtract money to player based on moneyDelta
      if (moneyDelta !== 0)
        await incrementPlayerMoney(ctx.player.id, moneyDelta)
      // add entropy to game
      if (entropyDelta !== 0)
        await addNewEntropy(entropyDelta, ctx.player.id, input.type == 'completed' ? 'contentFinished' : input.type == 'rerolled' ? 'contentRerolled' : 'contentDropped')


      await submitContentFinishFeed(ctx.prisma, {
        playerId: ctx.player.id,
        contentId: pTile.playerContent.contentId,
        status: input.type,
        player: ctx.player,
        content: pTile.playerContent.content,
        pointsDelta,
        moneyDelta,
        entropyDelta,
      })
      return null
    })
  }),
});
