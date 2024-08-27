import fs from 'fs';
import { z } from 'zod';
import _ from 'lodash';
import {
  adminProtectedProcedure,
  createTRPCRouter
} from "~/server/api/trpc";
import { shopItemFormSchema, truthFormSchema } from '../../../utils/forms';
import { TRPCClientError } from '@trpc/client';

export const adminRouter = createTRPCRouter({
  //! CONTENT
  getContentList: adminProtectedProcedure.input(z.object({
    types: z.enum(["game", "movie", "anime"]).array(),
    isApproved: z.boolean().optional(),
    isDeclined: z.boolean().optional(),
  })).query(({ ctx, input }) => {
    return ctx.prisma.content.findMany({
      where: {
        type: {
          in: input.types
        },
        isApproved: input.isApproved,
        isDeclined: input.isDeclined,
      },
      include: {
        DLCs: true,
        owner: true,
        addedBy: true,
      },
      orderBy: {
        updatedAt: 'asc'
      },
    });
  }),

  approveContent: adminProtectedProcedure.input(z.object({
    contentId: z.string(),
    qualityScore: z.number().min(1).max(100),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.content.update({
      where: {
        id: input.contentId
      },
      data: {
        isApproved: true,
        isDeclined: false,
        qualityScore: input.qualityScore,
      }
    });
  }),
  declineContent: adminProtectedProcedure.input(z.object({
    contentId: z.string(),
    declinedReason: z.string().min(1),
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.content.update({
      where: {
        id: input.contentId
      },
      data: {
        isApproved: false,
        isDeclined: true,
        declinedReason: input.declinedReason,
        declinedCounter: {
          increment: 1
        }
      }
    });
  }),

  //! SHOP
  getShopItems: adminProtectedProcedure.query(({ ctx }) => {
    return ctx.prisma.shopItem.findMany({
      include: {
        _count: {
          select: {
            stock: true,
          }
        }
      }
    });
  }),
  createShopItem: adminProtectedProcedure.input(shopItemFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.shopItem.create({
      data: {
        label: input.label,
        description: input.description,
        price: input.price,
        defaultStock: input.defaultStock,
        stockOwnershipRule: input.stockOwnerRule,
        stockRefreshRule: input.stockRefreshRule,
        image: {
          connect: {
            url: input.imageUrl
          }
        }
      }
    });
  }),

  //! truth
  getTruths: adminProtectedProcedure.query(({ ctx }) => {
    return ctx.prisma.truth.findMany({
      include: {
        addedBy: true,
      }
    });
  }),
  createTruth: adminProtectedProcedure.input(truthFormSchema).mutation(async ({ ctx, input }) => {
    const player = await ctx.prisma.player.findUnique({
      where: {
        userId: ctx.session.user.id
      }
    });
    if (!player)
      throw new TRPCClientError("Only players can add truths.");

    return ctx.prisma.truth.create({
      data: {
        id: input.id,
        label: input.label,
        truth: input.truth,
        lockedById: input.lockedById ? input.lockedById : null,
        category: input.category,
        rarity: input.rarity,
        addedById: player.id,
      }
    });
  }),



});
