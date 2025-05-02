"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  url: string;
  path: string[];
  heading: string;
  level: number;
  content: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchResults({
  results,
  isLoading,
  setOpen,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-muted-foreground py-16 text-center">
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((result) => (
        <Link
          key={result.id}
          href={result.url}
          onClick={() => setOpen(false)}
          className="hover:bg-muted block p-3 transition-colors"
        >
          <div className="flex items-start gap-3">
            <FileText className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
            <div>
              <div className="font-medium">{result.heading}</div>
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {result.content}
              </p>
              <div className="text-muted-foreground mt-1 text-xs">
                {result.path.join(" > ")}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
