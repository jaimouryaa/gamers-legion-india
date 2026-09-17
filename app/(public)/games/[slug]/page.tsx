import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug, getPublicGames } from "@/lib/queries/games";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import { formatINR, ogImageFor } from "@/lib/utils";
import { GameGrid } from "@/components/site/game-grid";
import { GameDetailActions } from "@/components/site/game-detail-actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game not found" };
  const description = game.shortDescription ?? game.description.slice(0, 155);
  const image = ogImageFor(game.bannerImage, game.coverImage);
  return {
    title: game.title,
    description,
    openGraph: {
      title: game.title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: game.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [game, allGames] = await Promise.all([getGameBySlug(slug), getPublicGames()]);
  if (!game) notFound();

  const related = allGames
    .filter((g) => g.id !== game.id && g.genre.some((x) => game.genre.includes(x)))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass-panel overflow-hidden rounded-3xl">
        <div className="relative h-56 sm:h-72">
          <CoverArt title={game.title} genre={game.genre} imageUrl={game.bannerImage ?? game.coverImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
                {game.title}
              </h1>
              <p className="mt-2 text-sm text-text-muted">{game.genre.join(" · ")}</p>
            </div>
            {game.discountPercentage > 0 && <DiscountBadge percentage={game.discountPercentage} />}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating value={game.rating} count={game.reviewCount} size="md" />
            <div className="flex flex-wrap gap-1.5">
              {game.platforms.map((p) => (
                <span key={p} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-text-secondary">
                  {p}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {game.description}
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border-glass bg-surface/60 p-6">
            <div>
              <Price original={game.originalPrice} sale={game.salePrice} size="lg" />
              {game.savings > 0 && (
                <p className="mt-1 text-xs font-medium text-success">
                  You save {formatINR(game.savings)}
                </p>
              )}
            </div>
            <GameDetailActions game={game} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-xl font-semibold text-text-primary">
            Related games
          </h2>
          <GameGrid games={related} />
        </div>
      )}
    </div>
  );
}
