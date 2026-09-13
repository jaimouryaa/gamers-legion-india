import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameByIdForAdmin } from "@/lib/queries/games";
import { GameForm } from "@/app/admin/(protected)/games/game-form";
import { updateGameAction } from "@/app/admin/(protected)/games/actions";

export const metadata: Metadata = { title: "Edit Game", robots: { index: false } };

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGameByIdForAdmin(id);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Edit {game.title}</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Discount % and savings update automatically when you change prices.
      </p>
      <GameForm game={game} action={updateGameAction.bind(null, id)} />
    </div>
  );
}
