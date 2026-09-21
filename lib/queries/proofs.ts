import { createClient } from "@/lib/supabase/server";
import { mapProofRow } from "@/lib/queries/mappers";
import { isSupabaseConfigured } from "@/lib/queries/games";
import type { Proof } from "@/lib/types";

/** Published delivery-proof screenshots, newest first, for the public /proof page. */
export async function getPublishedProofs(): Promise<Proof[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("proofs")
    .select("*, games(title, slug)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapProofRow);
}

/** All proofs regardless of published status — admin only. Relies on RLS to enforce this. */
export async function getAllProofsForAdmin(): Promise<Proof[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("proofs")
    .select("*, games(title, slug)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapProofRow);
}
