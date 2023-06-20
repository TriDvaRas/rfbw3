import { z } from "zod";
import {
  createTRPCRouter,
  playerProtectedProcedure,
  protectedProcedure
} from "~/server/api/trpc";
import { gameFormSchema } from "../../../components/modals/CreateGameModal";


export const contentRouter = createTRPCRouter({
  createGameContent: playerProtectedProcedure.input(gameFormSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.content.create({
      data: {
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

});
