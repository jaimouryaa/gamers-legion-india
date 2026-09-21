"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";
import { proofFormSchema } from "@/lib/validation/proof-schema";

export type ProofFormState = { error: string | null; fieldErrors?: Record<string, string> } | null;

export async function createProofAction(
  _prev: ProofFormState,
  formData: FormData
): Promise<ProofFormState> {
  // Re-checked here (not just trusted from the page that rendered the
  // form) for the same reason every other admin action does this: Server
  // Actions can be invoked directly and must not rely on layout checks alone.
  await requireAdmin();

  const raw = {
    imageUrl: String(formData.get("imageUrl") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    gameId: String(formData.get("gameId") ?? ""),
    published: formData.get("published") === "on",
  };

  const parsed = proofFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { error } = await supabase.from("proofs").insert({
    image_url: data.imageUrl,
    caption: data.caption || null,
    game_id: data.gameId || null,
    published: data.published,
  });

  if (error) {
    console.error("createProofAction — Supabase insert error:", error.message, error.code);
    return { error: "Couldn't save this proof. Try again." };
  }

  revalidatePath("/admin/proofs");
  revalidatePath("/proof");
  return null;
}

export async function togglePublished(id: string, published: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("proofs").update({ published }).eq("id", id);
  if (error) throw new Error("Couldn't update this proof.");
  revalidatePath("/admin/proofs");
  revalidatePath("/proof");
}

export async function deleteProof(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("proofs").delete().eq("id", id);
  if (error) throw new Error("Couldn't delete this proof.");
  revalidatePath("/admin/proofs");
  revalidatePath("/proof");
}
