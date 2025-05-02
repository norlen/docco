import { env } from "@/env";
import { MeiliSearch } from "meilisearch";

export const DOCS_INDEX = env.MEILISEARCH_DOCS_INDEX;

export const meilisearchClient = new MeiliSearch({
  host: env.MEILISEARCH_HOST_URL,
  apiKey: env.MEILISEARCH_API_KEY,
});
