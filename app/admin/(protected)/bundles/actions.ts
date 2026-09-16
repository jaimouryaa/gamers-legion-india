"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { bundleFormSchema } from "@/lib/validation/bundle-schema";
import { slugify } from "@/lib/utils";
import type { GameStatus } from "@/lib/types";

export type FormState = { error: string | null; fieldErrors?: Record<string, string> } | null;

function parseFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    bannerImage: String(formData.get("bannerImage") ?? ""),
    gameIds: formData.getAll("gameIds").map(String),
    originalPrice: formData.get("originalPrice"),
    bundlePrice: formData.get("bundlePrice"),
    rating: formData.get("rating") || undefined,
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") ?? "draft") as GameStatus,
    expiresAt: String(formData.get("expiresAt") ?? ""),
  };
}

export async function createBundleAction(_prev: FormState, formData: FormData): Promise<FormState> {
  // Re-checked here (not just trusted from the page that rendered the
  // form) — Server Actions are independently callable, so each one must
  // enforce its own authorization, same as every other admin action.
  await requireAdmin();

  const raw = parseFormData(formData);
  const parsed = bundleFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const data = parsed.data;
  const slug = slugify(data.name);

  const { error } = await supabase.from("bundles").insert({
    name: data.name,
    slug,
    description: data.description,
    banner_image: data.bannerImage || null,
    game_ids: data.gameIds,
    original_price: data.originalPrice,
    bundle_price: data.bundlePrice,
    rating: data.rating ?? null,
    featured: data.featured,
    status: data.status,
    expires_at: data.expiresAt || null,
  });

  if (error) {
    return {
      error: error.message.includes("duplicate")
        ? "A bundle with this name already exists."
        : "Couldn't save the bundle. Try again.",
    };
  }

  revalidatePath("/admin/bundles");
  revalidatePath("/");
  revalidatePath("/bundles");
  return null;
}

export async function updateBundleAction(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const raw = parseFormData(formData);
  const parsed = bundleFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { data: updated, error } = await supabase
    .from("bundles")
    .update({
      name: data.name,
      description: data.description,
      banner_image: data.bannerImage || null,
      game_ids: data.gameIds,
      original_price: data.originalPrice,
      bundle_price: data.bundlePrice,
      rating: data.rating ?? null,
      featured: data.featured,
      status: data.status,
      expires_at: data.expiresAt || null,
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) {
    return { error: "Couldn't save changes. Try again." };
  }

  revalidatePath("/admin/bundles");
  revalidatePath("/");
  revalidatePath("/bundles");
  revalidatePath(`/bundles/${updated.slug}`);
  return null;
}

export async function setBundleStatus(id: string, status: GameStatus) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("bundles").update({ status }).eq("id", id);
  if (error) throw new Error("Couldn't update status.");
  revalidatePath("/admin/bundles");
  revalidatePath("/");
  revalidatePath("/bundles");
}

export async function toggleBundleFeatured(id: string, featured: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("bundles").update({ featured }).eq("id", id);
  if (error) throw new Error("Couldn't update featured status.");
  revalidatePath("/admin/bundles");
  revalidatePath("/");
}

export async function deleteBundlePermanently(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("bundles").delete().eq("id", id);
  if (error) throw new Error("Couldn't delete the bundle.");
  revalidatePath("/admin/bundles");
  revalidatePath("/");
  revalidatePath("/bundles");
}
