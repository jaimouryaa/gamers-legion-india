import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameBySlug, getPublicGames } from "@/lib/queries/games";
import { CoverArt } from "@/components/ui/cover-art";
import { DiscountBadge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Price } from "@/components/ui/price";
import Link from "next/link";
import { formatINR, ogImageFor } from "@/lib/utils";
import { GameGrid } from "@/components/site/game-grid";
import { GameDetailActions } from "@/components/site/game-detail-actions";
import { CloseOnOutsideClick } from "@/components/site/close-on-outside-click";

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

  // Mobile-first tweaks: every compact value has an `sm:` value equal to the
  // original desktop design, so desktop is unchanged.
  return (
    <>
      <CloseOnOutsideClick className="px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
        <div data-keep-open className="mx-auto max-w-5xl">
          <div className="glass-panel overflow-hidden rounded-2xl sm:rounded-3xl">
            <div className="relative h-44 sm:h-72">
              <CoverArt title={game.title} genre={game.genre} imageUrl={game.bannerImage ?? game.coverImage} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
            </div>
            <div className="p-4 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="break-words font-display text-2xl font-bold leading-tight text-text-primary sm:text-4xl">
                    {game.title}
                  </h1>
                  <p className="mt-1.5 text-xs text-text-muted sm:mt-2 sm:text-sm">
                    {game.genre.join(" · ")}
                  </p>
                </div>
                {game.discountPercentage > 0 && <DiscountBadge percentage={game.discountPercentage} />}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2.5 sm:mt-4 sm:gap-4">
                <Rating value={game.rating} count={game.reviewCount} size="md" />
                <div className="flex flex-wrap gap-1.5">
                  {game.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-text-secondary sm:px-2.5 sm:py-1 sm:text-xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-text-secondary sm:mt-6 sm:text-sm">
                {game.description}
              </p>

              {/* On phones the price sits above full-width actions; from sm up it is the original side-by-side row. */}
              <div className="mt-5 flex flex-col gap-4 rounded-xl border border-border-glass bg-surface/60 p-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:rounded-2xl sm:p-6">
                <div>
                  <Price original={game.originalPrice} sale={game.salePrice} size="lg" />
                  {game.savings > 0 && (
                    <p className="mt-1 text-xs font-medium text-success">
                      You save {formatINR(game.savings)}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-auto">
                  <GameDetailActions game={game} />
                </div>
              </div>

              <div className="mt-5 sm:mt-8">
                <Link href="/proof" className="inline-block text-xs font-medium text-accent-cyan hover:underline">
                  See game activation & delivery proof →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CloseOnOutsideClick>

      {related.length > 0 && (
        <div className="mx-auto max-w-5xl px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8">
          <div className="mt-2">
            <h2 className="mb-4 font-display text-lg font-semibold text-text-primary sm:mb-6 sm:text-xl">
              Related games
            </h2>
            <GameGrid games={related} />
          </div>
        </div>
      )}
    </>
  );
}
