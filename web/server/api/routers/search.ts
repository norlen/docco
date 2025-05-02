import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { DOCS_INDEX } from "@/server/meilisearch";
import { z } from "zod";

export type SearchResult = {
  id: string;
  url: string;
  path: string[];
  heading: string;
  level: number;
  content: string;
};

const searchSchema = z.object({
  query: z.string().min(1),
});

export const searchRouter = createTRPCRouter({
  create: publicProcedure.input(searchSchema).query(async ({ ctx, input }) => {
    const { query } = input;
    const index = ctx.meilisearchClient.index(DOCS_INDEX);
    const searchResults = await index.search<SearchResult>(query, {
      limit: 10,
      attributesToRetrieve: [
        "id",
        "url",
        "path",
        "heading",
        "level",
        "content",
      ],
    });

    return searchResults.hits;
  }),
});
