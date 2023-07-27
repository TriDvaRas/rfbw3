import { createTRPCRouter } from "~/server/api/trpc";
import { playerContentRouter } from "./routers/playerContent";
import { playersRouter } from "./routers/players";
import { usersRouter } from "./routers/users";
import { uploadRouter } from "./routers/upload";
import { contentRouter } from "./routers/content";
import { rulesRouter } from "./routers/rules";
import { gameContentRouter } from "./routers/game/gameContent";
import { gameFeedRouter } from "./routers/game/gameFeed";
import { metaRouter } from "./routers/meta";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  playerContent: playerContentRouter,
  players: playersRouter,
  users: usersRouter,
  content: contentRouter,
  upload: uploadRouter,
  rules: rulesRouter,
  meta: metaRouter,
  game: createTRPCRouter({
    content: gameContentRouter,
    feed: gameFeedRouter,
  })
});

// export type definition of API
export type AppRouter = typeof appRouter;
