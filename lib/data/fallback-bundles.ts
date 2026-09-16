import type { Bundle } from "@/lib/types";
import { calcDiscount, slugify } from "@/lib/utils";

// Used only when Supabase isn't configured yet — mirrors fallback-games.ts.
// References fallback games by their known fallback-N ids so the demo
// bundle detail view has real games to cross-reference.
type SeedBundle = Omit<
  Bundle,
  "id" | "slug" | "discountPercentage" | "savings" | "createdAt" | "updatedAt"
>;

const raw: SeedBundle[] = [
  {
    name: "Epic Adventure Bundle",
    description:
      "Three of the biggest open-world action RPGs, bundled together at one low price — perfect if you're just building your library.",
    bannerImage: null,
    gameIds: ["fallback-0", "fallback-1", "fallback-2"],
    originalPrice: 4797,
    bundlePrice: 1999,
    rating: 4.8,
    featured: true,
    status: "active",
    expiresAt: null,
  },
  {
    name: "RPG Essentials Bundle",
    description:
      "A curated pair of award-winning RPGs for anyone who wants deep worlds and dozens of hours of story.",
    bannerImage: null,
    gameIds: ["fallback-6", "fallback-7"],
    originalPrice: 6998,
    bundlePrice: 2999,
    rating: 4.9,
    featured: true,
    status: "active",
    expiresAt: null,
  },
];

export const FALLBACK_BUNDLES: Bundle[] = raw.map((b, i) => {
  const { savings, discountPercentage } = calcDiscount(b.originalPrice, b.bundlePrice);
  const now = new Date(Date.now() - (raw.length - i) * 3600000).toISOString();
  return {
    ...b,
    id: `fallback-bundle-${i}`,
    slug: slugify(b.name),
    savings,
    discountPercentage,
    createdAt: now,
    updatedAt: now,
  };
});
