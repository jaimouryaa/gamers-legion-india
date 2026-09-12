import type { Game } from "@/lib/types";

// Supabase returns snake_case columns; the app works in camelCase.
// Keeping this mapping in one place avoids scattering `row.sale_price`
// vs `game.salePrice` mismatches across components.
export function mapGameRow(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    description: (row.description as string) ?? "",
    shortDescription: (row.short_description as string) ?? null,
    coverImage: (row.cover_image as string) ?? null,
    bannerImage: (row.banner_image as string) ?? null,
    genre: (row.genre as string[]) ?? [],
    platforms: (row.platforms as string[]) ?? [],
    originalPrice: Number(row.original_price),
    salePrice: Number(row.sale_price),
    discountPercentage: Number(row.discount_percentage) || 0,
    savings: Number(row.savings) || 0,
    rating: row.rating != null ? Number(row.rating) : null,
    reviewCount: row.review_count != null ? Number(row.review_count) : null,
    releaseDate: (row.release_date as string) ?? null,
    dealExpiry: (row.deal_expiry as string) ?? null,
    featured: Boolean(row.featured),
    status: row.status as Game["status"],
    tags: (row.tags as string[]) ?? [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
