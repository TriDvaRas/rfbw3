import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { gameFormSchema } from "../../../components/modals/CreateGameModal";
import { movieFormSchema } from "../../../components/modals/CreateMovieModal";
import { animeFormSchema } from "../../../components/modals/CreateAnimeModal";


export const contentRouter = createTRPCRouter({
  getMyContent: playerProtectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.content.findMany({
      where: {
        ownedById: ctx.player.id,
      },
      include: {
        DLCs: true,
      },
      orderBy: {
        createdAt: 'asc'
      },
    });
  }),
  createGameContent: playerProtectedProcedure.input(gameFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.content.create({
      data: {
        type: "game",
        label: input.label,
        title: input.fullname,
        hours: input.hours,
        hasCoop: input.maxPlayers > 1,
        maxCoopPlayers: input.maxPlayers,
        endCondition: input.endCondition,
        imageId: input.imageURL,
        genres: input.genres,
        comments: input.comments,
        addedById: ctx.player.id,
        ownedById: ctx.player.id,

        DLCs: {
          create: input.dlcs
        }
      },
    });
  }),
  createMovieContent: playerProtectedProcedure.input(movieFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.content.create({
      data: {
        type: "movie",
        label: input.label,
        title: input.fullname,
        hours: input.hours,
        hasCoop: true,
        maxCoopPlayers: 16,
        endCondition: '1 сезон/часть',
        imageId: input.imageURL,
        genres: input.genres,
        comments: input.comments,
        addedById: ctx.player.id,
        ownedById: ctx.player.id,

        DLCs: {
          create: input.dlcs
        }
      },
    });
  }),
  createAnimeContent: playerProtectedProcedure.input(animeFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.content.create({
      data: {
        type: "anime",
        label: input.label,
        title: input.fullname,
        hours: input.hours,
        hasCoop: true,
        maxCoopPlayers: 16,
        endCondition: '1 сезон/часть',
        imageId: input.imageURL,
        genres: input.genres,
        comments: input.comments,
        addedById: ctx.player.id,
        ownedById: ctx.player.id,

        DLCs: {
          create: input.dlcs
        }
      },
    });
  }),
  updateGameContent: playerProtectedProcedure.input(z.object({
    id: z.string(),
    data: gameFormSchema
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      // delete dlcs
      await prisma.contentDLC.deleteMany({
        where: {
          contentId: input.id,
        },
      });
      //update content and recreate dlcs
      return ctx.prisma.content.update({
        where: {
          id: input.id
        },
        data: {
          label: input.data.label,
          title: input.data.fullname,
          hours: input.data.hours,
          hasCoop: input.data.maxPlayers > 1,
          maxCoopPlayers: input.data.maxPlayers,
          endCondition: input.data.endCondition,
          imageId: input.data.imageURL,
          genres: input.data.genres,
          comments: input.data.comments,
          DLCs: {
            create: input.data.dlcs
          },
        }
      });
    });
  }),
  updateMovieContent: playerProtectedProcedure.input(z.object({
    id: z.string(),
    data: movieFormSchema
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      // delete dlcs
      await prisma.contentDLC.deleteMany({
        where: {
          contentId: input.id,
        },
      });
      //update content and recreate dlcs
      return ctx.prisma.content.update({
        where: {
          id: input.id
        },
        data: {
          label: input.data.label,
          title: input.data.fullname,
          hours: input.data.hours,
          imageId: input.data.imageURL,
          genres: input.data.genres,
          comments: input.data.comments,
          DLCs: {
            create: input.data.dlcs
          },
        }
      });
    });
  }),
  updateAnimeContent: playerProtectedProcedure.input(z.object({
    id: z.string(),
    data: animeFormSchema
  })).mutation(({ ctx, input }) => {
    return ctx.prisma.$transaction(async (prisma) => {
      // delete dlcs
      await prisma.contentDLC.deleteMany({
        where: {
          contentId: input.id,
        },
      });
      //update content and recreate dlcs
      return ctx.prisma.content.update({
        where: {
          id: input.id
        },
        data: {
          label: input.data.label,
          title: input.data.fullname,
          hours: input.data.hours,
          imageId: input.data.imageURL,
          genres: input.data.genres,
          comments: input.data.comments,
          DLCs: {
            create: input.data.dlcs
          },
        }
      });
    });
  }),
  deleteContent: playerProtectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.content.delete({
      where: {
        id: input
      }
    });
  }),
  getContentWithDLCs: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.prisma.content.findUnique({
      where: {
        id: input
      },
      include: {
        DLCs: true,
      }
    });
  }),
});
