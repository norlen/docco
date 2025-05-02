"use client";

import type { SearchResult, SearchResultHit } from "@/app/api/search/route";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchResults } from "./search-results";

interface SearchDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchDialog({ open, setOpen }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResultHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setResults([]);
      return;
    }

    const searchDocumentation = async () => {
      setIsLoading(true);
      try {
        // Using our stubbed API endpoint
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`,
        );
        const data = (await response.json()) as SearchResult;
        setResults(data.hits || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    searchDocumentation();
  }, [debouncedSearchQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 lg:max-w-[60rem]">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search documentation</DialogDescription>
        </DialogHeader>
        <div className="flex h-12 items-center gap-2 border-b px-3">
          <Search className="size-4 shrink-0 opacity-50" />
          <input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="placeholder:text-muted-foreground outline-hidden flex h-10 w-full rounded-md bg-transparent py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SearchResults
            results={results}
            isLoading={isLoading}
            setOpen={setOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
