import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type Navigation, navigation } from "@/server/db/schema";

export const navigationRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({ content: navigation.content })
      .from(navigation)
      .limit(1);

    if (rows.length === 0) {
      return undefined;
    }
    return JSON.parse(rows[0].content) as Navigation;
  }),
});
