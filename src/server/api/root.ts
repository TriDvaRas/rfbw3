import { createTRPCRouter } from "~/server/api/trpc";
import { fieldNodesRouter } from "./routers/fieldNodes";
import { playersRouter } from "./routers/players";
import { usersRouter } from "./routers/users";
import { uploadRouter } from "./routers/upload";
import { contentRouter } from "./routers/content";
import { rulesRouter } from "./routers/rules";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  fieldNodes: fieldNodesRouter,
  players: playersRouter,
  users: usersRouter,
  content: contentRouter,
  upload: uploadRouter,
  rules: rulesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
