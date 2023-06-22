import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure
} from "~/server/api/trpc";
import { gameFormSchema } from "../../../components/modals/CreateGameModal";
import { movieFormSchema } from "../../../components/modals/CreateMovieModal";


export const contentRouter = createTRPCRouter({
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
        addedById: ctx.session.user.id,
        ownedById: ctx.session.user.id,

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
        addedById: ctx.session.user.id,
        ownedById: ctx.session.user.id,

        DLCs: {
          create: input.dlcs
        }
      },
    });
  }),
  createAnimeContent: playerProtectedProcedure.input(movieFormSchema).mutation(({ ctx, input }) => {
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
        addedById: ctx.session.user.id,
        ownedById: ctx.session.user.id,

        DLCs: {
          create: input.dlcs
        }
      },
    });
  }),

});
