import fs from 'fs';
import { z } from 'zod';
import {
  adminProtectedProcedure,
  createTRPCRouter
} from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
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
});
