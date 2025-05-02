import { env } from "@/env";
import { MeiliSearch } from "meilisearch";

export function createClient(): MeiliSearch {
  const host = env.MEILISEARCH_HOST_URL;
  const apiKey = env.MEILISEARCH_API_KEY;

  return new MeiliSearch({ host, apiKey });
}
