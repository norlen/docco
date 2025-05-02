import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { pages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type Page = {
  slug: string;
  fullPath: string;
  title: string;
  content: string;
};

export const pagesRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ url: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { url } = input;
      const rows = await ctx.db
        .select({
          slug: pages.id,
          fullPath: pages.fullPath,
          title: pages.title,
          content: pages.content,
        })
        .from(pages)
        .where(eq(pages.url, url))
        .limit(1);

      if (rows.length === 0) {
        return undefined;
      }
      return rows[0] satisfies Page;
    }),
});
