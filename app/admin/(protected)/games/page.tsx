import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllGamesForAdmin } from "@/lib/queries/games";
import { GamesTable } from "@/app/admin/(protected)/games/games-table";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Manage Games", robots: { index: false } };

export default async function AdminGamesPage() {
  const games = await getAllGamesForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-primary">Games</h1>
          <p className="mt-1 text-sm text-text-muted">{games.length} total games in the catalog.</p>
        </div>
        <Link href="/admin/games/new">
          <Button>
            <Plus size={16} />
            Add game
          </Button>
        </Link>
      </div>
      <div className="mt-6">
        <GamesTable games={games} />
      </div>
    </div>
  );
}
