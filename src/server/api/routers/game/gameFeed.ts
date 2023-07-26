import { z } from "zod";
import {
  createTRPCRouter, publicProcedure
} from "~/server/api/trpc";


export const gameFeedRouter = createTRPCRouter({
  getFeed: publicProcedure.input(z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
  })).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const { cursor } = input;
    const items = await ctx.prisma.event.findMany({
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        coop: true,
        sourceContent: true,
        targetContent: true,
        sourcePlayer: true,
        targetPlayer: true,
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
  })

});
