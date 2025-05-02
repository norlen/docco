import { contentRouter } from "@/server/api/routers/content";
import { navigationRouter } from "@/server/api/routers/navigation";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { pagesRouter } from "./routers/pages";
import { searchRouter } from "./routers/search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  content: contentRouter,
  navigation: navigationRouter,
  pages: pagesRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
