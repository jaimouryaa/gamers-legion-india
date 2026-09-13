"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENRE_FILTERS, SORT_OPTIONS, type SortOption } from "@/lib/config";
import { GameGrid } from "@/components/site/game-grid";
import type { Game } from "@/lib/types";

export function CatalogExplorer({ games }: { games: Game[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState<(typeof GENRE_FILTERS)[number]>("All");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = games;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.genre.some((x) => x.toLowerCase().includes(q)) ||
          g.platforms.some((x) => x.toLowerCase().includes(q)) ||
          g.tags.some((x) => x.toLowerCase().includes(q))
      );
    }

    if (genre !== "All") {
      list = list.filter((g) => g.genre.includes(genre));
    }

    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        sorted.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "discount":
        sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "ending-soon":
        sorted.sort((a, b) => {
          if (!a.dealExpiry) return 1;
          if (!b.dealExpiry) return -1;
          return new Date(a.dealExpiry).getTime() - new Date(b.dealExpiry).getTime();
        });
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return sorted;
  }, [games, query, genre, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-border-glass-strong bg-surface px-4 py-2.5 focus-within:border-accent-primary/60">
          <Search size={16} className="shrink-0 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-text-muted hover:text-text-primary"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-border-glass-strong px-4 text-sm font-medium text-text-secondary hover:border-accent-primary/50 hover:text-text-primary sm:hidden"
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="hidden h-11 rounded-full border border-border-glass-strong bg-surface px-4 text-sm text-text-secondary focus:border-accent-primary/60 focus:outline-none sm:block"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={cn("mt-4 flex-wrap gap-2 sm:flex", filtersOpen ? "flex" : "hidden")}>
        {GENRE_FILTERS.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              genre === g
                ? "border-accent-primary/60 bg-accent-primary/10 text-accent-primary"
                : "border-border-glass text-text-secondary hover:border-border-glass-strong hover:text-text-primary"
            )}
          >
            {g}
          </button>
        ))}
      </div>

      {filtersOpen && (
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="mt-3 h-11 w-full rounded-full border border-border-glass-strong bg-surface px-4 text-sm text-text-secondary focus:border-accent-primary/60 focus:outline-none sm:hidden"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>
      )}

      <p className="mt-5 text-sm text-text-muted">
        {filtered.length} {filtered.length === 1 ? "game" : "games"} found
      </p>

      <div className="mt-4">
        <GameGrid games={filtered} />
      </div>
    </div>
  );
}
