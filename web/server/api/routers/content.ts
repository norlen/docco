import type { Document } from "@/lib/document";
import { processDocument } from "@/lib/document";
import { createNavigation } from "@/lib/document/navigation";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { navigation, pages, type Page } from "@/server/db/schema";
import { createClient } from "@/server/search";
import { nanoid } from "nanoid";
import { z } from "zod";

const contentSchema = z.object({
  fullPath: z.string().min(1),
  content: z.string().min(1),
});

function createPages(content: Document[]): Page[] {
  return content.map((item) => ({
    id: item.id,
    url: item.url,
    slug: item.slug,
    fullPath: item.fullPath,
    title: item.title,
    content: item.content,
  }));
}

const client = createClient();

export const contentRouter = createTRPCRouter({
  create: publicProcedure
    .input(contentSchema.array().min(1))
    .mutation(async ({ ctx, input }) => {
      const documents = input.map((item) =>
        processDocument(item.fullPath, item.content),
      );
      const navigationData = createNavigation(documents);
      const pagesData = createPages(documents);
      const allSections = documents.flatMap((item) => item.sections);

      const index = client.index("content");
      await index.deleteAllDocuments();

      await ctx.db.transaction(async (tx) => {
        await tx.delete(navigation);
        await tx.delete(pages);

        await tx.insert(navigation).values({
          id: nanoid(),
          content: JSON.stringify(navigationData),
        });

        await tx.insert(pages).values(pagesData);
      });

      await index.addDocuments(allSections);
    }),
});
