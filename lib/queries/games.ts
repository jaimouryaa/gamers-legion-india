import { createClient } from "@/lib/supabase/server";
import { mapGameRow } from "@/lib/queries/mappers";
import { FALLBACK_GAMES } from "@/lib/data/fallback-games";
import type { Game, GameStatus } from "@/lib/types";

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** All active, public-facing games (what visitors see). */
export async function getPublicGames(): Promise<Game[]> {
  if (!isSupabaseConfigured()) return FALLBACK_GAMES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) return FALLBACK_GAMES;
  return data.map(mapGameRow);
}

/** Games with a deal_expiry that hasn't passed yet — safe to call from a
 * Server Component since it's a plain helper, not a component render body. */
export function getActiveDeals(games: Game[]): Game[] {
  const now = Date.now();
  return games.filter((g) => g.dealExpiry && new Date(g.dealExpiry).getTime() > now);
}

export async function getFeaturedGames(): Promise<Game[]> {
  const games = await getPublicGames();
  return games.filter((g) => g.featured);
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const games = await getPublicGames();
  return games.find((g) => g.slug === slug) ?? null;
}

/** All games regardless of status — admin only. Relies on RLS to enforce this. */
export async function getAllGamesForAdmin(): Promise<Game[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapGameRow);
}

export async function getGameByIdForAdmin(id: string): Promise<Game | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapGameRow(data);
}

export async function getAdminKpis() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("games")
    .select("status, featured, deal_expiry");

  if (error || !data) {
    return { totalGames: 0, activeDeals: 0, featured: 0, expiringToday: 0 };
  }

  const totalGames = data.length;
  const activeDeals = data.filter(
    (g) => g.status === "active" && g.deal_expiry
  ).length;
  const featured = data.filter((g) => g.featured).length;
  const now = Date.now();
  const dayMs = 86400000;
  const expiringToday = data.filter((g) => {
    if (!g.deal_expiry) return false;
    const diff = new Date(g.deal_expiry as string).getTime() - now;
    return diff > 0 && diff <= dayMs;
  }).length;

  return { totalGames, activeDeals, featured, expiringToday };
}

export const STATUS_LABEL: Record<GameStatus, string> = {
  active: "Active",
  draft: "Draft",
  archived: "Archived",
  expired: "Expired",
};
