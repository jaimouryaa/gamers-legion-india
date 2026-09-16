import { createClient } from "@/lib/supabase/server";
import { mapBundleRow } from "@/lib/queries/mappers";
import { FALLBACK_BUNDLES } from "@/lib/data/fallback-bundles";
import { isSupabaseConfigured } from "@/lib/queries/games";
import type { Bundle } from "@/lib/types";

/** All active, public-facing bundles. */
export async function getPublicBundles(): Promise<Bundle[]> {
  if (!isSupabaseConfigured()) return FALLBACK_BUNDLES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) return FALLBACK_BUNDLES;
  return data.map(mapBundleRow);
}

export async function getFeaturedBundles(): Promise<Bundle[]> {
  const bundles = await getPublicBundles();
  return bundles.filter((b) => b.featured);
}

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
  const bundles = await getPublicBundles();
  return bundles.find((b) => b.slug === slug) ?? null;
}

/** All bundles regardless of status — admin only. Relies on RLS to enforce this. */
export async function getAllBundlesForAdmin(): Promise<Bundle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapBundleRow);
}

export async function getBundleByIdForAdmin(id: string): Promise<Bundle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapBundleRow(data);
}
