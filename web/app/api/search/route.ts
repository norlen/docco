import { env } from "@/env";
import {
  type FacetDistribution,
  type FacetsByIndex,
  type FacetStats,
  MeiliSearch,
} from "meilisearch";
import { type NextRequest, NextResponse } from "next/server";

const DOCS_INDEX = env.MEILISEARCH_DOCS_INDEX;

const client = new MeiliSearch({
  host: env.MEILISEARCH_HOST_URL,
  apiKey: env.MEILISEARCH_API_KEY,
});

export type SearchResult = {
  processingTimeMs: number;
  query: string;
  facetDistribution?: FacetDistribution;
  facetStats?: FacetStats;
  facetsByIndex?: FacetsByIndex;
  hits: SearchResultHit[];
};

export type SearchResultHit = {
  id: string;
  url: string;
  path: string[];
  heading: string;
  level: number;
  content: string;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ hits: [] });
  }

  try {
    const index = client.index(DOCS_INDEX);
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

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("Meilisearch error:", error);
    return NextResponse.json(
      { error: "Failed to search documentation" },
      { status: 500 },
    );
  }
}
