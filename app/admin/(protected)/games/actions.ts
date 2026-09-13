"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { gameFormSchema } from "@/lib/validation/game-schema";
import { slugify } from "@/lib/utils";
import type { GameStatus } from "@/lib/types";

export type FormState = { error: string | null; fieldErrors?: Record<string, string> } | null;

function parseFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    bannerImage: String(formData.get("bannerImage") ?? ""),
    genre: formData.getAll("genre").map(String),
    platforms: formData.getAll("platforms").map(String),
    originalPrice: formData.get("originalPrice"),
    salePrice: formData.get("salePrice"),
    rating: formData.get("rating") || undefined,
    reviewCount: formData.get("reviewCount") || undefined,
    releaseDate: String(formData.get("releaseDate") ?? ""),
    dealExpiry: String(formData.get("dealExpiry") ?? ""),
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") ?? "draft") as GameStatus,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export async function createGameAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Defense in depth: this action can be invoked directly even if the UI is
  // hidden, so it must re-check admin status itself rather than trust the
  // page that rendered the form.
  await requireAdmin();

  const raw = parseFormData(formData);
  const parsed = gameFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const data = parsed.data;
  const slug = slugify(data.title);

  const { error } = await supabase.from("games").insert({
    title: data.title,
    slug,
    description: data.description,
    short_description: data.shortDescription || null,
    cover_image: data.coverImage || null,
    banner_image: data.bannerImage || null,
    genre: data.genre,
    platforms: data.platforms,
    original_price: data.originalPrice,
    sale_price: data.salePrice,
    rating: data.rating ?? null,
    review_count: data.reviewCount ?? 0,
    release_date: data.releaseDate || null,
    deal_expiry: data.dealExpiry || null,
    featured: data.featured,
    status: data.status,
    tags: data.tags ?? [],
  });

  if (error) {
    return { error: error.message.includes("duplicate") ? "A game with this title already exists." : "Couldn't save the game. Try again." };
  }

  revalidatePath("/admin/games");
  revalidatePath("/");
  revalidatePath("/games");
  return null;
}

export async function updateGameAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const raw = parseFormData(formData);
  const parsed = gameFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { error } = await supabase
    .from("games")
    .update({
      title: data.title,
      description: data.description,
      short_description: data.shortDescription || null,
      cover_image: data.coverImage || null,
      banner_image: data.bannerImage || null,
      genre: data.genre,
      platforms: data.platforms,
      original_price: data.originalPrice,
      sale_price: data.salePrice,
      rating: data.rating ?? null,
      review_count: data.reviewCount ?? 0,
      release_date: data.releaseDate || null,
      deal_expiry: data.dealExpiry || null,
      featured: data.featured,
      status: data.status,
      tags: data.tags ?? [],
    })
    .eq("id", id);

  if (error) {
    return { error: "Couldn't save changes. Try again." };
  }

  revalidatePath("/admin/games");
  revalidatePath("/");
  revalidatePath("/games");
  revalidatePath(`/games/${raw.title ? slugify(raw.title) : ""}`);
  return null;
}

export async function setGameStatus(id: string, status: GameStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("games").update({ status }).eq("id", id);
  if (error) throw new Error("Couldn't update status.");
  revalidatePath("/admin/games");
  revalidatePath("/");
  revalidatePath("/games");
}

export async function toggleFeatured(id: string, featured: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("games").update({ featured }).eq("id", id);
  if (error) throw new Error("Couldn't update featured status.");
  revalidatePath("/admin/games");
  revalidatePath("/");
}

export async function deleteGamePermanently(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) throw new Error("Couldn't delete the game.");
  revalidatePath("/admin/games");
  revalidatePath("/");
  revalidatePath("/games");
}
