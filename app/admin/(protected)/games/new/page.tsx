import type { Metadata } from "next";
import { GameForm } from "@/app/admin/(protected)/games/game-form";
import { createGameAction } from "@/app/admin/(protected)/games/actions";

export const metadata: Metadata = { title: "Add Game", robots: { index: false } };

export default function NewGamePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Add a new game</h1>
      <p className="mt-1 mb-6 text-sm text-text-muted">
        Discount % and savings are calculated automatically from the prices you enter.
      </p>
      <GameForm action={createGameAction} />
    </div>
  );
}
