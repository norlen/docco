"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchDialog } from "./search-dialog";

type SearchProps = {
  className?: string;
};

export function SearchButton({ className }: SearchProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "text-muted-foreground relative h-9 justify-start pr-12 text-sm",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only inline-flex">Search...</span>
        {/* <kbd className="bg-muted pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd> */}
        <kbd className="hidden font-sans text-xs/4 [.os-macos_&]:block">⌘K</kbd>
        <kbd className="not-[.os-macos_&]:block hidden font-sans text-xs/4">
          Ctrl+K
        </kbd>
      </Button>
      <SearchDialog open={open} setOpen={setOpen} />
    </>
  );
}
